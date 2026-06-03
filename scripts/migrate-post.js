import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import sharp from "sharp";

const SOURCE_IMAGES_DIR = "/Users/stackpenguin/Documents/KingKaiZhuang.github.io/source/images";

async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("❌ 請指定來源文章檔案\n範例: node scripts/migrate-post.js /path/to/source.md");
        process.exit(1);
    }

    const sourcePath = path.resolve(args[0]);
    if (!fs.existsSync(sourcePath)) {
        console.error(`❌ 找不到檔案: ${sourcePath}`);
        process.exit(1);
    }

    console.log(`🚀 開始搬移文章: ${path.basename(sourcePath)}`);

    // 1. 複製內容到 draft.md
    const draftPath = path.join(process.cwd(), "draft.md");
    fs.copyFileSync(sourcePath, draftPath);
    console.log("✅ 複製文章至 draft.md");

    // 2. 執行 auto-post
    console.log("⏳ 執行 auto-post (包含 OpenAI 呼叫，請稍候)...");
    let stdout;
    try {
        stdout = execSync("node scripts/auto-cover-post.js draft.md", { encoding: "utf8" });
        console.log(stdout);
    } catch (error) {
        console.error("❌ auto-post 執行失敗:");
        console.error(error.stdout);
        console.error(error.stderr);
        process.exit(1);
    }

    // 3. 找出生成的 index.md 路徑
    const match = stdout.match(/📄 Markdown: (.*)/);
    if (!match) {
        console.error("❌ 無法從輸出中找到生成的 Markdown 檔案路徑");
        process.exit(1);
    }

    const markdownPath = match[1].trim();
    const postDir = path.dirname(markdownPath);
    console.log(`✅ 成功定位新文章: ${markdownPath}`);

    // 4. 解析圖片並壓縮搬移，同時替換原始發布日期
    let originalContent = fs.readFileSync(sourcePath, "utf8");
    let originalDateMatch = originalContent.match(/date:\s*(.*)/);
    let originalDate = originalDateMatch ? originalDateMatch[1].trim() : "";

    let content = fs.readFileSync(markdownPath, "utf8");
    if (originalDate) {
        // Extract just the YYYY-MM-DD part or use the whole thing. The twilight theme likes YYYY-MM-DD
        // Let's format it properly if needed, or just use what's there.
        // Usually it's "2024-09-30 23:22:52". Let's keep it as is, or split by space.
        const dateString = originalDate.split(" ")[0].replace(/'"/g, '');
        content = content.replace(/published:\s*[\d-]+/, `published: ${dateString}`);
        console.log(`✅ 已還原原始發布日期: ${dateString}`);
    }

    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
    let matchImg;
    
    // We need to match and replace sequentially or by tracking replacements.
    // Instead of replacing blindly, we'll collect all images first.
    const imagesToProcess = [];
    while ((matchImg = imageRegex.exec(content)) !== null) {
        const altText = matchImg[1];
        let imgUrl = matchImg[2];
        
        // 處理 URL 參數（例如 ?v=123）
        imgUrl = imgUrl.split("?")[0];

        // 我們只處理 /images/ 開頭的本地圖片
        if (imgUrl.startsWith("/images/")) {
            // decode URI components in case of spaces or special chars
            const decodedImgUrl = decodeURIComponent(imgUrl);
            const sourceImgPath = path.join(SOURCE_IMAGES_DIR, decodedImgUrl.replace("/images/", ""));
            
            if (fs.existsSync(sourceImgPath)) {
                imagesToProcess.push({
                    originalUrl: matchImg[2],
                    sourcePath: sourceImgPath,
                    altText
                });
            } else {
                console.warn(`⚠️ 找不到來源圖片: ${sourceImgPath}`);
            }
        }
    }

    for (const imgInfo of imagesToProcess) {
        try {
            console.log(`🗜️ 處理圖片: ${path.basename(imgInfo.sourcePath)}`);
            
            // Generate a safe new filename
            const ext = path.extname(imgInfo.sourcePath).toLowerCase();
            const baseName = path.basename(imgInfo.sourcePath, ext).replace(/[^a-z0-9]/gi, "-");
            let newFileName = `${baseName}.jpg`; // we will convert everything to jpg
            
            let outputPath = path.join(postDir, newFileName);
            
            // If the name is exactly the same as the cover, add a suffix
            let counter = 1;
            while (fs.existsSync(outputPath)) {
                newFileName = `${baseName}-${counter}.jpg`;
                outputPath = path.join(postDir, newFileName);
                counter++;
            }

            // Compress with sharp
            await sharp(imgInfo.sourcePath)
                .jpeg({ quality: 60, mozjpeg: true })
                .toFile(outputPath);

            console.log(`✅ 圖片壓縮完成: ${newFileName}`);

            // Replace in markdown
            content = content.replace(imgInfo.originalUrl, `./${newFileName}`);
        } catch (err) {
            console.error(`❌ 處理圖片失敗 ${imgInfo.sourcePath}:`, err.message);
        }
    }

    fs.writeFileSync(markdownPath, content, "utf8");
    console.log(`🎉 圖片處理與路徑替換完成!`);
}

main().catch(console.error);
