import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import dotenv from "dotenv";

dotenv.config();

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN; // e.g. https://pub-xxx.r2.dev or https://img.domain.com

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET_NAME || !PUBLIC_DOMAIN) {
    console.error("❌ 請在 .env 中填寫完整的 R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN");
    process.exit(1);
}

const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});

const POSTS_DIR = path.resolve("./src/content/posts");

function getAllMarkdownFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllMarkdownFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

function encodeR2Path(filePath) {
    return filePath.split('/').map(part => encodeURIComponent(part)).join('/');
}

async function uploadToR2(localPath, r2Key) {
    const fileStream = fs.createReadStream(localPath);
    const contentType = mime.lookup(localPath) || "application/octet-stream";

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: r2Key,
        Body: fileStream,
        ContentType: contentType,
    });

    try {
        await s3.send(command);
        return true;
    } catch (err) {
        console.error(`❌ 上傳失敗: ${localPath}`, err.message);
        return false;
    }
}

async function main() {
    console.log("🚀 開始掃描 Markdown 並上傳圖片至 Cloudflare R2...");

    // Normalize PUBLIC_DOMAIN to ensure no trailing slash
    const domain = PUBLIC_DOMAIN.endsWith('/') ? PUBLIC_DOMAIN.slice(0, -1) : PUBLIC_DOMAIN;

    const files = getAllMarkdownFiles(POSTS_DIR);

    for (const filePath of files) {
        let content = fs.readFileSync(filePath, "utf-8");
        const dir = path.dirname(filePath);
        let modified = false;
        let newContent = content;

        // Cover image processing
        const coverMatch = /^cover:\s*(['"]?)(.+?)\1/m.exec(newContent);
        if (coverMatch) {
            const coverPath = coverMatch[2];
            let localImagePath = null;
            let blobPath = null;

            // Handle existing Azure URLs, B2 URLs, or local relative paths
            if (coverPath.includes("blob.core.windows.net") || coverPath.includes("backblazeb2.com")) {
                const urlObj = new URL(coverPath);
                // B2 structure: /file/BucketName/images/...
                // Azure structure: /container/images/...
                const decodedPath = decodeURIComponent(urlObj.pathname.split("/images/")[1]);
                localImagePath = path.join(POSTS_DIR, decodedPath);
                blobPath = `images/${decodedPath.replace(/\\/g, "/")}`;
            } else if (coverPath.startsWith("./") || coverPath.startsWith("../")) {
                localImagePath = path.resolve(dir, coverPath);
                blobPath = `images/${path.relative(POSTS_DIR, localImagePath).replace(/\\/g, "/")}`;
            }

            if (localImagePath && fs.existsSync(localImagePath)) {
                console.log(`⬆️ 正在上傳封面圖片至 R2: ${blobPath}`);
                const success = await uploadToR2(localImagePath, blobPath);
                if (success) {
                    const r2Url = `${domain}/${encodeR2Path(blobPath)}`;
                    newContent = newContent.replace(coverMatch[0], `cover: "${r2Url}"`);
                    modified = true;
                    console.log(`✅ 成功替換封面圖片為 R2 網址: ${r2Url}`);
                }
            }
        }

        // Inline images processing: ![alt](url)
        const regex = /!\[(.*?)\]\((.+?)\)/g;
        let match;
        const matches = [];

        while ((match = regex.exec(content)) !== null) {
            matches.push({
                fullMatch: match[0],
                alt: match[1],
                url: match[2]
            });
        }

        for (const m of matches) {
            let localImagePath = null;
            let blobPath = null;

            if (m.url.includes("blob.core.windows.net") || m.url.includes("backblazeb2.com")) {
                const urlObj = new URL(m.url);
                const decodedPath = decodeURIComponent(urlObj.pathname.split("/images/")[1]);
                localImagePath = path.join(POSTS_DIR, decodedPath);
                blobPath = `images/${decodedPath.replace(/\\/g, "/")}`;
            } else if (m.url.startsWith("./") || m.url.startsWith("../")) {
                localImagePath = path.resolve(dir, m.url);
                blobPath = `images/${path.relative(POSTS_DIR, localImagePath).replace(/\\/g, "/")}`;
            }

            if (localImagePath && fs.existsSync(localImagePath)) {
                console.log(`⬆️ 正在上傳內文圖片至 R2: ${blobPath}`);
                const success = await uploadToR2(localImagePath, blobPath);
                if (success) {
                    const r2Url = `${domain}/${encodeR2Path(blobPath)}`;
                    newContent = newContent.replace(m.fullMatch, `![${m.alt}](${r2Url})`);
                    modified = true;
                    console.log(`✅ 成功替換內文圖片為 R2 網址`);
                }
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, newContent, "utf-8");
            console.log(`📝 已更新 Markdown 檔案: ${path.relative(POSTS_DIR, filePath)}`);
        }
    }

    console.log("🎉 圖片全數遷移至 Cloudflare R2 並修改完成！請執行 pnpm run publish");
}

main().catch(console.error);
