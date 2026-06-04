# StackPenguin Blog 使用與維護指南

這份文件記錄了本部落格專案的日常操作流程與設定方式，方便您未來快速上手與維護。
npm run auto-post draft.md
npx vercel --prod
---

## 1. 本地開發與預覽 (Local Development)

當您想要在本地電腦預覽網站效果時，請在終端機 (Terminal) 進入專案目錄，並執行以下指令：

```bash
pnpm dev
```

伺服器啟動後，請在瀏覽器打開 `http://localhost:4321`（依終端機顯示的網址為準）。
開發伺服器支援**即時熱更新 (Hot Reload)**，當您修改程式碼或設定檔時，網頁會自動重新整理顯示最新結果。

---

## 2. 如何發布新文章 (Writing a New Post)

您的專案已經配置了專屬的自動化腳本來處理文章發布與圖片壓縮。

### 步驟流程：
1. **編輯草稿**：在專案根目錄中找到並編輯 `draft.md` 檔案。
2. **填寫文章屬性 (Frontmatter)**：確保文章的最上方包含必要的資訊，例如：
   ```yaml
   ---
   title: 您的文章標題
   date: 2026-06-03
   tags:
     - "標籤1"
   categories:
     - "分類1"
   ---
   ```
3. **撰寫內容**：在下方撰寫您的 Markdown 文章內容。
   - **💡 提示**：如果您在文章中插入程式碼區塊時忘記標示語言（例如 `javascript` 或 `python`），系統內建的 AI 猜測外掛會自動幫您識別並上色，不需擔心版面全白！
4. **自動化處理與歸檔**：寫完後，在終端機執行以下指令：
   ```bash
   pnpm run auto-post draft.md
   ```
   腳本會自動抓取封面、將圖片高效率壓縮（Quality: 50），並將該篇文章完整轉移到 `src/content/posts` 資料夾內，完成發布！

---

## 3. 修改網站整體設定 (Site Configuration)

網站的所有主要設定都集中在專案根目錄的 **`twilight.config.yaml`** 中。
您可以直接編輯該檔案來調整以下內容：

- **基本資訊**：網站標題 (`siteName`)、副標題、大頭貼名稱與簡介。
- **選單導覽 (Menu)**：調整側邊欄的選單項目。目前已精簡為「首頁」、「文章」、「分類」、「標籤」、「關於」等必要頁面。
- **音樂播放器**：可以在設定中調整是否自動播放音樂 (`autoplay: false`)。

---

## 4. 客製化版面紀錄 (Customizations)

我們為此專案進行了以下客製化修改，請注意不要隨意覆蓋相關檔案：
- **大頭貼比例**：已在 `src/components/sidebar/profile.astro` 調整了合適的大小。
- **文章列表圖片**：在 `src/components/post/postCard.astro` 中，為手機版加上了 **16:9** 的統一比例，並將電腦版的卡片高度固定為 `220px`，解決了圖片忽大忽小的問題。
- **簡介字數限制**：文章列表的描述 (description) 已統一限制為 **最多顯示兩行**，超過會自動以 `...` 省略。
- **程式碼自動上色**：新增了 `src/plugins/remark-guess-lang.js` 擴充套件，遇到未標示語言的程式碼會自動使用 `highlight.js` 判別上色。

---

## 5. 部署到線上環境 (Deployment)

您的專案已經完全適配 **Vercel**（設定檔為 `vercel.json`，且已設定小寫專案名稱 `stackpenguinblog`）。

### 方法一：透過 GitHub 自動部署（推薦 ⭐）
只要您將變更（例如寫好的新文章）推送到 GitHub：
```bash
git add .
git commit -m "發布新文章"
git push
```
Vercel 就會自動抓取最新進度，並在 1~2 分鐘內自動更新您的線上網站。

### 方法二：透過 Vercel CLI 手動部署
在終端機輸入：
```bash
npx vercel --prod --yes
```
等待打包完成後，您的正式網站就會同步更新。

🌐 **正式網址**：[https://stackpenguinblog.vercel.app](https://stackpenguinblog.vercel.app)
