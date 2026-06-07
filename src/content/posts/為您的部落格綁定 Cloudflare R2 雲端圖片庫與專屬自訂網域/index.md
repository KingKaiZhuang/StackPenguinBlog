---
title: 為您的部落格綁定 Cloudflare R2 雲端圖片庫與專屬自訂網域
published: 2026-06-07
description: "在這篇教學中，我們將學習如何將網站的靜態圖片搬到 Cloudflare R2 雲端空間，並且為它綁定您自己專屬的網域。"
cover: "https://img.stackpenguin.com/images/%E7%82%BA%E6%82%A8%E7%9A%84%E9%83%A8%E8%90%BD%E6%A0%BC%E7%B6%81%E5%AE%9A%20Cloudflare%20R2%20%E9%9B%B2%E7%AB%AF%E5%9C%96%E7%89%87%E5%BA%AB%E8%88%87%E5%B0%88%E5%B1%AC%E8%87%AA%E8%A8%82%E7%B6%B2%E5%9F%9F/cloudflare-r2-setup.jpg"
coverInContent: false
tags:
  - Cloudflare
  - R2
  - 教學
  - CDN
  - 網域綁定
category: 網站架設
draft: false
---

# 為什麼要使用 Cloudflare R2？

在這篇教學中，我們將學習如何將網站的靜態圖片搬到 <mark>Cloudflare R2</mark> 雲端空間，並且為它綁定您自己專屬的網域！比起 <mark>Amazon S3</mark> 或 <mark>Backblaze B2</mark>，<mark>Cloudflare R2</mark> 最大的優勢在於：<mark>免除所有流量傳輸費 (Egress Fee)</mark>，這對於一個擁有大量圖片的部落格來說，可以省下非常可觀的成本。

### 為什麼不直接把圖片存在 GitHub 就好？

很多人剛開始架設靜態網站時，會習慣把圖片直接丟進專案資料夾，跟著程式碼一起推送到 GitHub，然後交給 Vercel 或 Netlify 託管。雖然這很方便，但當您的網站成長時，會遇到兩個致命問題：

1. <mark>Git 倉庫肥大化與效能災難</mark>：Git 的設計初衷是用來追蹤純文字程式碼，並不擅長處理圖片等二進位大檔案。隨著文章變多，您的專案很快就會膨脹到好幾 GB，未來不僅本地打包速度變慢，<mark>Vercel 每次 Build 的時間也會被大幅拉長</mark>。
2. <mark>流量與頻寬限制（隱藏的帳單殺手）</mark>：<mark>Vercel</mark> 的免費方案對頻寬與 <mark>Image Optimization</mark> (圖片最佳化) 都有嚴格的額度限制。如果您的網站流量變大，或是遭到惡意抓取，很快就會觸發高昂的超額收費。

相反地，將圖片抽離出來交給 <mark>Cloudflare R2</mark> 託管，不僅能保持 GitHub 倉庫永遠輕巧（只有幾 MB 大小），還能享受全世界最大 <mark>CDN</mark> 的光速載入優勢，最重要的是——<mark>免收任何流出流量費</mark>！這是一張部落格經營者的終極免死金牌。

## 步驟一：建立 R2 Bucket

1. 首先登入您的 Cloudflare 後台。
2. 在左側選單找到 <mark>R2 Object Storage</mark>。
3. 點擊右上角的 <mark>Create bucket</mark>。
4. 輸入您的 <mark>Bucket</mark> 名稱 (例如 `my-blog-images`)，並點擊 Create。

## 步驟二：取得 R2 API 金鑰

為了讓自動發文腳本能夠把圖片傳到 R2，我們需要取得 API 金鑰：
1. 回到 R2 首頁，點擊右上角的 <mark>Manage R2 API Tokens</mark>。
2. 點擊 <mark>Create API token</mark>。
3. 權限設定請選擇 <mark>Object Read & Write</mark>，以便我們能上傳圖片。
4. 點擊 <mark>Create API Token</mark> 後，請妥善複製並保存您的 <mark>Access Key ID</mark> 與 <mark>Secret Access Key</mark>，因為它們只會顯示一次！

## 步驟三：設定本地端的環境變數

在您的專案根目錄找到 `.env` 檔案，並填入剛剛拿到的金鑰與設定：

```bash
R2_ACCOUNT_ID=您的_Cloudflare_帳號_ID
R2_ACCESS_KEY_ID=您的_Access_Key
R2_SECRET_ACCESS_KEY=您的_Secret_Key
R2_BUCKET_NAME=您的_Bucket_名稱
R2_PUBLIC_DOMAIN=https://pub-xxxxx.r2.dev # (此為開發測試網址，下一步會教您替換)
```

## 步驟四：為 R2 綁定專屬自訂網域 (強烈建議！)

> ⚠️ Cloudflare R2 預設提供的 <mark>.r2.dev</mark> 網址具有存取次數限制，且網址過長、缺乏品牌識別度，不利於 <mark>SEO</mark>。強烈建議一定要綁定自訂的子網域！

1. 點進您的 R2 Bucket，點選上方的 <mark>Settings (設定)</mark>。
2. 往下捲動找到 <mark>Public Access (公開存取)</mark> 區塊。
3. 點擊 <mark>Connect Domain (連接網域)</mark>。
4. 輸入您想要綁定的子網域（例如：`img.yourdomain.com` 或 `assets.yourdomain.com`）。
   > **注意：** 請勿綁定您的主網域 (`yourdomain.com`)，這會導致您的主網站無法正常連線！
5. 點擊繼續，Cloudflare 就會自動在您的 <mark>DNS</mark> 紀錄中加上這筆 <mark>CNAME</mark> 設定。

等待狀態變成 <mark>Active</mark> 後，您就可以將 `.env` 裡的 `R2_PUBLIC_DOMAIN` 更新為 `https://img.yourdomain.com` 囉！

大功告成！現在您的部落格不僅能光速載入圖片，還能用自己專屬的網域，對 <mark>SEO</mark> 大大加分！
