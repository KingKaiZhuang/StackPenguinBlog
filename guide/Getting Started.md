---
title: 主題指南 - 快速開始
published: 2001-10-02
description: "如何使用這個部落格主題。"
cover: "./Cover - Getting Started.jpg"
coverInContent: false
pinned: true
tags: []
category:
    - 指南:
        - 快速開始
draft: false
---


提示：關於本指南中未提及的內容，您可以在 [Astro Docs](https://docs.astro.build/) 中找到答案。


## 文章的 Front-matter

```yaml
---
title: 我的第一篇部落格文章
published: 2020-02-02
description: 這是我的新 Astro 部落格的第一篇文章。
cover: ./cover.jpg
coverInContent: false
tags: []
category: 日常
comment: true
draft: false
---
```


| 屬性 | 描述 |
|------------------|------------------|
| `title` | 文章的標題。 |
| `published` | 文章發布的日期。 |
| `pinned` | 是否將此文章置頂於文章列表的頂部。 |
| `description` | 文章的簡短描述。顯示在首頁。 |
| `cover` | 文章的封面圖片路徑。<br/>1. 以 `http://` 或 `https://` 開頭：代表網路圖片 <br/>2. 以 `/` 開頭：代表 `public` 目錄下的圖片 <br/>3. 無上述前綴：相對於 markdown 檔案的路徑 |
| `coverInContent` | 是否在文章內容中顯示封面圖片。 |
| `tags` | 文章的標籤。 |
| `category` | 文章的分類 <br/>1. 單一分類：`category: 指南` <br/>2. 多重分類：`category: [指南, 快速開始]` |
| `licenseName` | 文章內容的授權條款名稱。 |
| `author` | 文章的作者。 |
| `sourceLink` | 文章內容的來源連結或參考資料。 |
| `comment` | 是否為此文章啟用留言功能。預設為 `true`。 |
| `draft` | 如果此文章仍是草稿，將不會被顯示出來。 |


## 文章檔案放置位置

您的文章檔案應該放在 `src/content/posts/` 目錄中。您也可以建立子目錄來更好地整理您的文章和靜態資源。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.jpg
    └── index.md
```