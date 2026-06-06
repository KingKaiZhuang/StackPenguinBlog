import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.TURSO_DATABASE_URL || "file:StackPenguinBlog.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const isCloud = dbUrl.startsWith("libsql://") || dbUrl.startsWith("https://");
console.log(`\n🔌 目前資料庫連線模式: ${isCloud ? "☁️ 雲端 (Turso)" : "📁 本地 (Local SQLite)"}`);
console.log(`🔗 連線網址: ${dbUrl}\n`);

const client = createClient({
    url: dbUrl,
    authToken: authToken,
});

const POSTS_DIR = path.resolve("./src/content/posts");

async function initDB() {
    await client.execute(`
        CREATE TABLE IF NOT EXISTS posts (
            slug TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            published TEXT NOT NULL,
            updated TEXT,
            description TEXT,
            cover TEXT,
            coverInContent BOOLEAN,
            category TEXT,
            tags TEXT,
            lang TEXT,
            pinned BOOLEAN,
            author TEXT,
            sourceLink TEXT,
            licenseName TEXT,
            licenseUrl TEXT,
            comment BOOLEAN,
            draft BOOLEAN,
            encrypted BOOLEAN,
            password TEXT,
            routeName TEXT,
            prevTitle TEXT,
            prevSlug TEXT,
            nextTitle TEXT,
            nextSlug TEXT,
            content TEXT NOT NULL
        )
    `);
    console.log("✅ 資料表 posts 確認完畢");
}

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

async function syncPosts() {
    console.log("🚀 開始掃描 Markdown 文章並同步至 Turso...");
    await initDB();

    if (!fs.existsSync(POSTS_DIR)) {
        console.error(`❌ 找不到文章目錄: ${POSTS_DIR}`);
        return;
    }

    const files = getAllMarkdownFiles(POSTS_DIR);
    console.log(`找到 ${files.length} 篇文章，準備同步...`);

    for (const filePath of files) {
        try {
            // Slug is the directory name if it's an index file, or the filename without extension
            const ext = path.extname(filePath);
            const fileName = path.basename(filePath, ext);
            let slug = fileName;
            
            if (fileName === "index") {
                slug = path.basename(path.dirname(filePath));
            }

            const fileContent = fs.readFileSync(filePath, "utf-8");
            const { data: frontmatter, content } = matter(fileContent);

            // Extract tags and category as JSON strings if they exist
            const tags = frontmatter.tags ? JSON.stringify(frontmatter.tags) : "[]";
            const category = frontmatter.category ? (Array.isArray(frontmatter.category) ? JSON.stringify(frontmatter.category) : JSON.stringify([frontmatter.category])) : '""';

            // Format dates
            const published = frontmatter.published ? new Date(frontmatter.published).toISOString() : new Date().toISOString();
            const updated = frontmatter.updated ? new Date(frontmatter.updated).toISOString() : null;

            // Execute UPSERT
            await client.execute({
                sql: `
                    INSERT INTO posts (
                        slug, title, published, updated, description, cover, coverInContent, 
                        category, tags, lang, pinned, author, sourceLink, licenseName, 
                        licenseUrl, comment, draft, encrypted, password, routeName, 
                        prevTitle, prevSlug, nextTitle, nextSlug, content
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                    )
                    ON CONFLICT(slug) DO UPDATE SET
                        title=excluded.title,
                        published=excluded.published,
                        updated=excluded.updated,
                        description=excluded.description,
                        cover=excluded.cover,
                        coverInContent=excluded.coverInContent,
                        category=excluded.category,
                        tags=excluded.tags,
                        lang=excluded.lang,
                        pinned=excluded.pinned,
                        author=excluded.author,
                        sourceLink=excluded.sourceLink,
                        licenseName=excluded.licenseName,
                        licenseUrl=excluded.licenseUrl,
                        comment=excluded.comment,
                        draft=excluded.draft,
                        encrypted=excluded.encrypted,
                        password=excluded.password,
                        routeName=excluded.routeName,
                        prevTitle=excluded.prevTitle,
                        prevSlug=excluded.prevSlug,
                        nextTitle=excluded.nextTitle,
                        nextSlug=excluded.nextSlug,
                        content=excluded.content
                `,
                args: [
                    slug,
                    frontmatter.title || slug,
                    published,
                    updated,
                    frontmatter.description || "",
                    frontmatter.cover || "",
                    frontmatter.coverInContent ?? false,
                    category,
                    tags,
                    frontmatter.lang || "",
                    frontmatter.pinned ?? false,
                    frontmatter.author || "",
                    frontmatter.sourceLink || "",
                    frontmatter.licenseName || "",
                    frontmatter.licenseUrl || "",
                    frontmatter.comment ?? true,
                    frontmatter.draft ?? false,
                    frontmatter.encrypted ?? false,
                    frontmatter.password || "",
                    frontmatter.routeName || "",
                    frontmatter.prevTitle || "",
                    frontmatter.prevSlug || "",
                    frontmatter.nextTitle || "",
                    frontmatter.nextSlug || "",
                    content
                ]
            });

            console.log(`✅ 已同步: ${slug}`);
        } catch (err) {
            console.error(`❌ 同步失敗 (${filePath}):`, err.message);
        }
    }

    console.log("🎉 所有文章同步完成！");
}

syncPosts().catch(console.error);
