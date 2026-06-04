---
title: Mac 儲存空間大掃除實戰：從 56GB 拯救到 84GB 的過程紀錄
published: 2026-06-04
description: "這篇筆記紀錄了一次幫 Mac 進行深度儲存空間清理的過程，成功將可用空間從 56 GB 提升至近 85 GB！"
cover: "./mac-storage-cleanup.jpg"
coverInContent: false
tags:
  - macOS
  - 清理
  - 教學
  - 儲存空間
  - 技巧
category: 技術
draft: false
---

這篇筆記紀錄了一次幫 Mac 進行深度儲存空間清理的過程，成功將可用空間從 <mark>56 GB 提升至近 85 GB！</mark>

## 1. 清理應用程式快取 (Caches)

macOS 系統與各種應用程式會在 `~/Library/Caches` 累積大量的暫存檔，這些檔案通常可以安全刪除。

在這一次清理中，發現了以下佔用大戶：
- **Google Chrome**: 3.3 GB
- **Brave 瀏覽器**: 2.0 GB
- **VS Code 更新檔**: 1.0 GB
- **pip 暫存**: 531 MB
- **Homebrew**: 344 MB

**清理方法**：
透過終端機執行 `rm -rf ~/Library/Caches/*`，這項操作非常安全，成功釋放了約 **11 GB** 的空間。

## 2. 清理應用程式支援檔 (Application Support)

在 `~/Library/Application Support` 資料夾中，存放了許多軟體的設定檔與離線資料，有些不常用的軟體會在這裡偷偷佔用巨大空間。

我們發現並清理了：
- **Notion**: 6.7 GB (累積過多離線快取資料)
- **Unity**: 3.2 GB (不再使用的遊戲開發資源)

針對確定不需要的軟體，直接刪除其對應的資料夾，又找回了將近 **10 GB** 的空間。

## 3. 揪出隱藏的 Chrome 怪物級 Bug 🐛

最驚人的一點，是在排查「系統資料」為何高達 50 多 GB 時，在 `/private/var/folders/` 的深處發現了一個名為 `com.google.Chrome.code_sign_clone` 的資料夾。

**這是什麼？**
這是 macOS 上一個知名的 Chrome 自動更新 Bug，它會在背景更新時不斷製造無用的暫存檔卻不刪除。

**佔用了多少空間？**
帳面上這個資料夾竟然高達 **69 GB**！不過由於 macOS APFS 檔案系統的「檔案複製 (Clone)」機制，許多檔案是共用實體硬碟區塊的。

**清理結果**：
執行刪除指令後，實際上為實體硬碟討回了約 **11 ~ 15 GB** 的空間。

## 總結

透過這次的大掃除，總共找回了將近 **30 GB** 的空間：
- 系統與一般快取：**11 GB**
- Notion & Unity 肥大資料：**~10 GB**
- Chrome 更新 Bug 暫存：**~12 GB**

如果你也發現 Mac 的空間莫名其妙被吃掉，不妨照著上述的三個方向去檢查看看！

