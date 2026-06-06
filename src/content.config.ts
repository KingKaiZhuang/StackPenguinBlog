import { defineCollection } from "astro:content";
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

import { getCategoryPathParts } from "@utils/category";
import { parseTags } from "@utils/tag";


// Helper for handling dates that might be empty strings from JSON
const dateSchema = z.preprocess((arg) => {
    if (typeof arg === "string" && arg.trim() === "") return undefined;
    return arg;
}, z.coerce.date());
const optionalDateSchema = z.preprocess((arg) => {
    if (typeof arg === "string" && arg.trim() === "") return undefined;
    return arg;
}, z.coerce.date().optional());

const categorySchema = z.preprocess((arg) => {
    const parts = getCategoryPathParts(arg as any);
    return parts ?? arg;
}, z.union([z.string(), z.array(z.string())]).optional().nullable().default(""));

const tagsSchema = z.preprocess((arg) => {
    return parseTags(arg);
}, z.array(z.string()).optional().default([]));

import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const tursoLoader = {
    name: "turso-posts",
    load: async ({ store, parseData, logger, config, entryTypes, generateDigest }) => {
        const dbUrl = process.env.TURSO_DATABASE_URL || "file:StackPenguinBlog.db";
        const authToken = process.env.TURSO_AUTH_TOKEN;
        const isCloud = dbUrl.startsWith("libsql://") || dbUrl.startsWith("https://");
        logger.info(`🔌 資料庫連線模式: ${isCloud ? "☁️ 雲端 (Turso)" : "📁 本地 (Local SQLite)"}`);

        const client = createClient({
            url: dbUrl,
            authToken: authToken,
        });

        const rs = await client.execute("SELECT * FROM posts");
        logger.info(`從 Turso 載入了 ${rs.rows.length} 篇文章`);

        store.clear();

        // 取得 Astro 的 Markdown 解析器
        const markdownEntryType = entryTypes.get(".md");
        let renderFn = null;
        if (markdownEntryType && markdownEntryType.getRenderFunction) {
            renderFn = await markdownEntryType.getRenderFunction(config);
        }

        for (const row of rs.rows) {
            const tags = JSON.parse((row.tags as string) || "[]");
            const category = JSON.parse((row.category as string) || '""');

            const rawData = {
                title: row.title,
                published: row.published,
                updated: row.updated || "",
                description: row.description,
                cover: row.cover,
                coverInContent: Boolean(row.coverInContent),
                category: category,
                tags: tags,
                lang: row.lang,
                pinned: Boolean(row.pinned),
                author: row.author,
                sourceLink: row.sourceLink,
                licenseName: row.licenseName,
                licenseUrl: row.licenseUrl,
                comment: Boolean(row.comment),
                draft: Boolean(row.draft),
                encrypted: Boolean(row.encrypted),
                password: row.password,
                routeName: row.routeName,
                prevTitle: row.prevTitle,
                prevSlug: row.prevSlug,
                nextTitle: row.nextTitle,
                nextSlug: row.nextSlug,
            };

            const parsedData = await parseData({
                id: row.slug as string,
                data: rawData,
            });

            const body = row.content as string;
            const digest = generateDigest ? generateDigest(body) : "";

            let rendered;
            if (renderFn) {
                try {
                    // 為了讓 Astro 能正確解析相對路徑圖片，我們需要還原原本的 filePath
                    const fs = await import("fs");
                    const path = await import("path");
                    let originalFilePath = `src/content/posts/${row.slug}.md`;
                    if (!fs.existsSync(path.resolve(originalFilePath))) {
                        originalFilePath = `src/content/posts/${row.slug}/index.md`;
                    }

                    rendered = await renderFn({
                        id: row.slug as string,
                        data: parsedData,
                        body: body,
                        filePath: path.resolve(originalFilePath), 
                        digest: digest
                    });
                } catch (err) {
                    logger.error(`Render error for ${row.slug}: ${err.message}`);
                }
            }

            store.set({
                id: row.slug as string,
                data: parsedData,
                body: body,
                digest: digest,
                rendered: rendered,
                assetImports: rendered?.metadata?.imagePaths,
            });
        }
    },
};

const postsCollection = defineCollection({
    loader: tursoLoader,
    schema: z.object({
        title: z.string(),
        published: dateSchema,
        updated: optionalDateSchema,
        description: z.string().optional().default(""),
        cover: z.string().optional().default(""),
        coverInContent: z.boolean().optional().default(false),
        category: categorySchema,
        tags: tagsSchema,
        lang: z.string().optional().default(""),
        pinned: z.boolean().optional().default(false),
        author: z.string().optional().default(""),
        sourceLink: z.string().optional().default(""),
        licenseName: z.string().optional().default(""),
        licenseUrl: z.string().optional().default(""),
        comment: z.boolean().optional().default(true),
        draft: z.boolean().optional().default(false),

        /* Page encryption fields */
        encrypted: z.boolean().optional().default(false),
        password: z.string().optional().default(""),

        /* Custom routeName */
        routeName: z.string().optional(),

        /* For internal use */
        prevTitle: z.string().default(""),
        prevSlug: z.string().default(""),
        nextTitle: z.string().default(""),
        nextSlug: z.string().default(""),
    }),
});

const specCollection = defineCollection({
    loader: glob({ pattern: '[^_]*.{md,mdx}', base: "./src/content" }),
    schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
    }),
});

export const collections = {
    posts: postsCollection,
    spec: specCollection,
};