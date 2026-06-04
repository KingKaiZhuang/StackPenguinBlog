# 自動發文完整步驟

這份文件專門記錄如何使用自動化腳本來發布新文章。

## 1. 撰寫草稿
在專案根目錄中找到 `draft.md` 檔案，並使用 Markdown 語法撰寫您的文章內容。

請務必在文章的最上方加上文章的屬性設定 (Frontmatter)：
```yaml
---
title: 您的文章標題
date: 2026-06-04
tags:
  - "標籤1"
categories:
  - "分類1"
---
```

*(💡 提示：如果文章中有程式碼，就算忘記標註語言（如 python / js），系統也會自動幫您猜測並上色！)*

## 2. 執行自動發文腳本
寫完內容後，請打開終端機 (Terminal)，確認路徑在專案根目錄，然後輸入以下指令：

```bash
pnpm run auto-post draft.md
```
> **注意**：這支程式會自動為您的文章配上封面圖片、高效率壓縮圖片，並將整篇文章打包轉移到正式的 `src/content/posts` 資料夾中。

## 3. 推送與部署 (讓文章上線)
腳本執行成功後，文章已經在本地端準備完畢。請將變更推送到 GitHub，讓 Vercel 自動更新網站：

```bash
git add .
git commit -m "feat: 發布新文章"
git push
```
*(推送到 GitHub 後，Vercel 就會在 1~2 分鐘內自動抓取最新進度並更新您的網站)*

---
**其他備用方式**
如果您沒有使用 GitHub 自動部署，也可以直接透過 Vercel CLI 手動發布：
```bash
npx vercel --prod
```
