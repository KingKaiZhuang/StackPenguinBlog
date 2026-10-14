import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import sharp from "sharp";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const textModel = process.env.OPENAI_TEXT_MODEL || "gpt-5-mini";
const imageModel = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

if (!apiKey) {
    console.error("❌ OPENAI_API_KEY 未設定");
    process.exit(1);
}

const client = new OpenAI({ apiKey });
const args = process.argv.slice(2).filter((arg, index) => !(index === 0 && arg === "--"));

if (args.length === 0) {
    console.error("❌ 請指定文章檔案\n\n範例:\npnpm run auto-post draft.md\n測試輸出：\npnpm run auto-post draft.md -- --output-dir ./tmp/auto-post");
    process.exit(1);
}

const articlePath = path.resolve(args[0]);
const outputDirFlagIndex = args.indexOf("--output-dir");
const outputRoot = outputDirFlagIndex === -1
    ? path.join(process.cwd(), "src/content/posts")
    : path.resolve(args[outputDirFlagIndex + 1] || "");

if (outputDirFlagIndex !== -1 && !args[outputDirFlagIndex + 1]) {
    console.error("❌ --output-dir 後方必須指定資料夾路徑");
    process.exit(1);
}

if (!fs.existsSync(articlePath)) {
    console.error(`❌ 找不到檔案: ${articlePath}`);
    process.exit(1);
}

const articleContent = fs.readFileSync(articlePath, "utf8");

function sanitizeFileName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "cover";
}

function sanitizeFolderName(name) {
    return name.replace(/[\/\\?%*:|"<>]/g, "-");
}

function getBody(markdown) {
    if (!markdown.startsWith("---")) return markdown;
    const endMatch = markdown.indexOf("\n---", 3);
    return endMatch === -1 ? markdown : markdown.slice(endMatch + 4).trimStart();
}

function getFrontmatterValue(markdown, key) {
    const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) return "";

    const line = frontmatter[1].match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    if (!line) return "";

    return line[1].trim().replace(/^(?:"|')|(?:"|')$/g, "");
}

const metadataSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        title: { type: "string" },
        description: { type: "string" },
        tags: { type: "array", items: { type: "string" }, maxItems: 5 },
        category: { type: "string" },
        image_filename: { type: "string" },
        key_text: { type: "string" },
        topic_description: { type: "string" },
    },
    required: [
        "title",
        "description",
        "tags",
        "category",
        "image_filename",
        "key_text",
        "topic_description",
    ],
};

async function generateMetadata(article) {
    const response = await client.responses.create({
        model: textModel,
        instructions: `You are an expert technical editor. Analyze the supplied Markdown article and return metadata. Use Traditional Chinese for title, description, tags, category and key_text. Use concise English for topic_description. image_filename must be English kebab-case.`,
        input: article,
        text: {
            format: {
                type: "json_schema",
                name: "article_metadata",
                strict: true,
                schema: metadataSchema,
            },
        },
    });

    if (!response.output_text) {
        throw new Error("文字模型未回傳 metadata");
    }

    return JSON.parse(response.output_text);
}

async function highlightArticle(body) {
    const response = await client.responses.create({
        model: textModel,
        instructions: `你是一位專業的文字編輯與內容分析師。請只在提供的 Markdown 內新增少量 <mark>...</mark> 標記，標示最重要的見解、術語、數據或結論。絕對不可改動任何其他文字、標題、連結、公式、程式碼區塊、表格或 Markdown 語法。請只輸出完整 Markdown，不要加入說明。`,
        input: body,
    });

    if (!response.output_text) {
        throw new Error("文字模型未回傳重點標記後的文章");
    }

    return response.output_text.trim();
}

async function generateImage(prompt) {
    const result = await client.images.generate({
        model: imageModel,
        prompt,
        size: "1024x1024",
        quality: "medium",
        output_format: "png",
    });

    const imageBase64 = result.data[0]?.b64_json;
    if (!imageBase64) {
        throw new Error("圖片生成失敗，未收到 Base64 資料");
    }

    return Buffer.from(imageBase64, "base64");
}

async function main() {
    try {
        console.log(`🧠 使用 ${textModel} 分析文章內容...`);
        const meta = await generateMetadata(articleContent);
        const sourceLink = getFrontmatterValue(articleContent, "sourceLink");

        console.log("✅ 標題:", meta.title);
        console.log("✅ 關鍵字:", meta.key_text);
        console.log(`🎨 使用 ${imageModel} 產生封面圖片...`);

        const imagePrompt = `Modern minimalist vector illustration, flat design, clean lines, generous negative space, and a soft pastel palette. Center the Traditional Chinese text "${meta.key_text}" in a clean bold sans-serif font. Frame it with small, clear icons of ${meta.topic_description}. Use a clean white gradient background. No logos or watermarks.`;
        const imageBuffer = await generateImage(imagePrompt);

        console.log("🗜️ 壓縮圖片中...");
        const compressedBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 50, mozjpeg: true })
            .toBuffer();

        const postDir = path.join(outputRoot, sanitizeFolderName(meta.title));
        fs.mkdirSync(postDir, { recursive: true });

        const imageFileName = `${sanitizeFileName(meta.image_filename)}.jpg`;
        const imagePath = path.join(postDir, imageFileName);
        fs.writeFileSync(imagePath, compressedBuffer);

        console.log("✅ 圖片已儲存");
        console.log("🖍️ 自動幫文章畫重點...");
        const contentBody = await highlightArticle(getBody(articleContent));

        const now = new Date();
        const publishDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const frontmatter = `---
title: ${meta.title}
published: ${publishDate}
description: "${meta.description.replaceAll('"', '\\"')}"
cover: "./${imageFileName}"
coverInContent: false
tags:
${meta.tags.map((tag) => `  - ${tag}`).join("\n")}
category: ${meta.category}
${sourceLink ? `sourceLink: ${JSON.stringify(sourceLink)}\n` : ""}draft: false
draft: false
---

${contentBody}
`;

        const markdownPath = path.join(postDir, "index.md");
        fs.writeFileSync(markdownPath, frontmatter, "utf8");

        console.log("\n🎉 建立完成");
        console.log(`📄 Markdown: ${markdownPath}`);
        console.log(`🖼️ 圖片: ${imagePath}`);
    } catch (error) {
        console.error("\n❌ 發生錯誤");
        console.error(error);
        process.exit(1);
    }
}

main();
