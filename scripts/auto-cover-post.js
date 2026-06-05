import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import sharp from "sharp";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error("❌ OPENAI_API_KEY 未設定");
    process.exit(1);
}

const client = new OpenAI({
    apiKey
});

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error(
        "❌ 請指定文章檔案\n\n範例:\npnpm run auto-post draft.md"
    );
    process.exit(1);
}

const articlePath = path.resolve(args[0]);

if (!fs.existsSync(articlePath)) {
    console.error(`❌ 找不到檔案: ${articlePath}`);
    process.exit(1);
}

const articleContent = fs.readFileSync(
    articlePath,
    "utf8"
);

function sanitizeFileName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function sanitizeFolderName(name) {
    return name.replace(/[\/\\?%*:|"<>]/g, "-");
}

async function generateMetadata(article) {
    const response =
        await client.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: {
                type: "json_object"
            },
            messages: [
                {
                    role: "system",
                    content: `
You are an expert technical editor.

Analyze the article and return JSON only.

Required fields:

{
  "title": "",
  "description": "",
  "tags": [],
  "category": "",
  "image_filename": "",
  "key_text": "",
  "topic_description": ""
}

Rules:

1. title 使用繁體中文
2. description 使用繁體中文
3. tags 最多 5 個
4. image_filename 使用英文 kebab-case
5. key_text: 文章主題的繁體中文關鍵文字 (例如: 學習 PYTHON, 設計系統, 高效率習慣)
6. topic_description: 必須是英文 (English)，填入與關鍵文字相關的簡潔視覺內容描述 (例如: a python snake, a terminal window, brackets, an IDE icon, and data visualizations)
`
                },
                {
                    role: "user",
                    content: article
                }
            ]
        });

    return JSON.parse(
        response.choices[0].message.content
    );
}

async function highlightArticle(article) {
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `你是一位專業的文字編輯與內容分析師。你的任務是自動化地在提供的 Markdown 文章中，將重要的詞彙或段落標記高亮。

嚴格規則：
1. 標記方式：請使用 <mark>...</mark> 標籤來包覆關鍵見解、重要專有名詞、核心數據或總結性結論。
2. 精簡標記：切勿過度標記。請只針對最關鍵、讀者最需要一眼看出的片段進行高亮，以保持文章易讀性。
3. 避開特殊區塊：絕對不可以在標題 (例如 # 標題)、超連結語法或程式碼區塊 (\`\`\`...\`\`\`) 內部加入 <mark> 標籤，以免破壞原有格式。
4. 保持原貌：除了新增 <mark> 標籤外，絕對不可修改任何原始文字內容、排版或其他 Markdown 語法。必須 100% 保留原文。
5. 輸出限制：請直接回傳加上標記後的 Markdown 完整內容，不要輸出任何開場白、結尾語、程式碼區塊標記 (如 \`\`\`markdown) 或額外的對話文字。`
            },
            {
                role: "user",
                content: article
            }
        ]
    });
    return response.choices[0].message.content.trim();
}

async function generateImage(prompt) {
    const result =
        await client.images.generate({
            model: "gpt-image-2",
            prompt,
            size: "1024x1024"
        });

    const imageBase64 =
        result.data[0].b64_json;

    if (!imageBase64) {
        throw new Error(
            "圖片生成失敗，未收到 Base64 資料"
        );
    }

    return Buffer.from(
        imageBase64,
        "base64"
    );
}

async function main() {
    try {
        console.log("🧠 分析文章內容...");

        const meta =
            await generateMetadata(
                articleContent
            );

        console.log("✅ 標題:", meta.title);
        console.log("✅ 關鍵字:", meta.key_text);

        console.log("🎨 產生封面圖片...");

        const imagePrompt = `Modern minimalist vector illustration, flat design, clean lines, negative space, a soft pastel and muted color palette. The text "${meta.key_text}" in a large, clean, bold sans-serif font, centered prominently. Small, clear, relevant icons of ${meta.topic_description} frame the text in a clean layout. Clean white gradient background. High quality, detailed illustration.`;

        const imageBuffer =
            await generateImage(imagePrompt);

        console.log("🗜️ 壓縮圖片中...");
        const compressedBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 50, mozjpeg: true })
            .toBuffer();

        const safeTitle =
            sanitizeFolderName(
                meta.title
            );

        const postDir = path.join(
            process.cwd(),
            "src/content/posts",
            safeTitle
        );

        fs.mkdirSync(postDir, {
            recursive: true
        });

        const imageFileName =
            `${sanitizeFileName(
                meta.image_filename
            )}.jpg`;

        const imagePath = path.join(
            postDir,
            imageFileName
        );

        fs.writeFileSync(
            imagePath,
            compressedBuffer
        );

        console.log("✅ 圖片已儲存");

        const now = new Date();

        const publishDate =
            `${now.getFullYear()}-${String(
                now.getMonth() + 1
            ).padStart(2, "0")}-${String(
                now.getDate()
            ).padStart(2, "0")}`;

        let contentBody = articleContent;
        if (contentBody.startsWith("---")) {
            const endMatch = contentBody.indexOf("\n---", 3);
            if (endMatch !== -1) {
                contentBody = contentBody.slice(endMatch + 4).trimStart();
            }
        }

        console.log("🖍️ 自動幫文章畫重點...");
        contentBody = await highlightArticle(contentBody);

        const frontmatter = `---
title: ${meta.title}
published: ${publishDate}
description: "${meta.description}"
cover: "./${imageFileName}"
coverInContent: false
tags:
${meta.tags && meta.tags.length > 0 ? meta.tags.map(tag => `  - ${tag}`).join("\n") : "[]"}
category: ${meta.category}
draft: false
---

${contentBody}
`;

        const markdownPath =
            path.join(
                postDir,
                "index.md"
            );

        fs.writeFileSync(
            markdownPath,
            frontmatter,
            "utf8"
        );

        console.log("");
        console.log("🎉 建立完成");
        console.log(
            `📄 Markdown: ${markdownPath}`
        );
        console.log(
            `🖼️ 圖片: ${imagePath}`
        );
    } catch (error) {
        console.error("");
        console.error("❌ 發生錯誤");
        console.error(error);

        process.exit(1);
    }
}

main();