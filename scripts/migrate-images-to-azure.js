import fs from "fs";
import path from "path";
import { ContainerClient } from "@azure/storage-blob";
import mime from "mime-types";
import dotenv from "dotenv";
dotenv.config();

const sasUrl = process.env.AZURE_BLOB_SAS_URL;

if (!sasUrl) {
    console.error("❌ 請在 .env 中設定 AZURE_BLOB_SAS_URL");
    console.log("範例: ");
    console.log("AZURE_BLOB_SAS_URL=https://myaccount.blob.core.windows.net/mycontainer?sv=...&sp=racwd...");
    process.exit(1);
}

// 直接使用完整 SAS URL
const containerClient = new ContainerClient(sasUrl);

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

async function uploadToAzure(localFilePath, blobName) {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // 如果 blob 已經存在，可以選擇略過或覆蓋 (這裡預設覆蓋)
    const contentType = mime.lookup(localFilePath) || "application/octet-stream";
    
    console.log(`⬆️ 正在上傳: ${blobName}`);
    await blockBlobClient.uploadFile(localFilePath, {
        blobHTTPHeaders: { blobContentType: contentType }
    });

    // 回傳公開網址 (不含 SAS Token，假設容器已設為公開讀取)
    return blockBlobClient.url.split("?")[0];
}

async function processFile(filePath) {
    let content = fs.readFileSync(filePath, "utf-8");
    const dir = path.dirname(filePath);
    
    let modified = false;
    let newContent = content;

    // 處理 frontmatter 中的 cover
    const coverMatch = /^cover:\s*(['"]?)(.+?)\1/m.exec(newContent);
    if (coverMatch) {
        const coverPath = coverMatch[2];
        if (coverPath.startsWith("./") || coverPath.startsWith("../")) {
            const imageLocalPath = path.resolve(dir, coverPath);
            if (fs.existsSync(imageLocalPath)) {
                const relativeToPosts = path.relative(POSTS_DIR, imageLocalPath);
                const blobName = `images/${relativeToPosts.replace(/\\/g, "/")}`;
                try {
                    const publicUrl = await uploadToAzure(imageLocalPath, blobName);
                    newContent = newContent.replace(coverMatch[0], `cover: "${publicUrl}"`);
                    modified = true;
                    console.log(`✅ 成功替換封面圖片: ${coverPath} -> ${publicUrl}`);
                } catch (err) {
                    console.error(`❌ 封面圖片上傳失敗: ${imageLocalPath}`, err.message);
                }
            } else {
                console.warn(`⚠️ 找不到本地封面圖片檔案: ${imageLocalPath}`);
            }
        }
    }

    // 尋找所有 Markdown 圖片語法: ![alt](./image.jpg) 或 ![alt](../image.jpg)
    const regex = /!\[(.*?)\]\(((\.\/|\.\.\/)[^)]+)\)/g;
    let match;
    const matches = [];

    while ((match = regex.exec(content)) !== null) {
        matches.push({
            fullMatch: match[0],
            alt: match[1],
            relativePath: match[2]
        });
    }

    // 不要 early return，因為可能封面圖片被修改了但內文沒有圖片

    for (const m of matches) {
        const imageLocalPath = path.resolve(dir, m.relativePath);

        if (fs.existsSync(imageLocalPath)) {
            // 以 slug 或資料夾名稱作為 Azure 上的目錄
            // 例如: src/content/posts/my-post/index.md -> my-post
            const relativeToPosts = path.relative(POSTS_DIR, imageLocalPath);
            const blobName = `images/${relativeToPosts.replace(/\\/g, "/")}`;

            try {
                const publicUrl = await uploadToAzure(imageLocalPath, blobName);
                
                // 替換 Markdown 內容
                newContent = newContent.replace(m.fullMatch, `![${m.alt}](${publicUrl})`);
                modified = true;
                console.log(`✅ 成功替換: ${m.relativePath} -> ${publicUrl}`);
            } catch (err) {
                console.error(`❌ 上傳失敗: ${imageLocalPath}`, err.message);
            }
        } else {
            console.warn(`⚠️ 找不到本地圖片檔案: ${imageLocalPath}`);
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, newContent, "utf-8");
        console.log(`📝 已更新 Markdown 檔案: ${path.relative(POSTS_DIR, filePath)}`);
    }
}

async function main() {
    console.log("🚀 開始掃描文章與圖片...");

    const files = getAllMarkdownFiles(POSTS_DIR);
    for (const file of files) {
        await processFile(file);
    }
    
    console.log("🎉 圖片上傳與 Markdown 替換完成！");
}

main().catch(console.error);
