---
title: 主題指南 - 進階自訂
published: 2024-02-10
description: "掌握 Twilight 主題的進階功能與自訂選項。"
cover: "./Cover - Advanced Customization.jpg"
coverInContent: false
pinned: false
tags: []
category:
    - 指南:
        - 進階自訂
draft: false
---


本指南涵蓋了 Twilight 主題中可用的進階自訂選項與功能，從全域設定到特殊的 Markdown 擴充語法。


## 全域設定

`twilight.config.yaml` 檔案是您部落格設定的核心。以下是您可以調整的一些進階設定：

### 網站與本地化

- **語言與翻譯**：透過 `site.translate.enable` 啟用客戶端翻譯功能。您可以選擇不同的服務並設定自動偵測。

- **自訂字體**：在 `site.font` 下提供 CSS 連結或檔案路徑來新增您自己的字體。

### 視覺效果

- **主題色**：調整 `site.themeColor.hue` (0-360) 來改變部落格的主要顏色。

- **桌布模式**：可選擇 `banner` (橫幅)、`fullscreen` (全螢幕) 或 `none` (無)。您也可以啟用 `carousel` (輪播) 以顯示多張帶有 `kenBurns` 效果的桌布。

- **波紋效果**：透過 `site.wallpaper.banner.waves.enable` 開關橫幅上的水波紋動畫效果。

- **粒子效果**：透過 `particle.enable` 啟用背景中的漂浮粒子。

### 使用者介面 (UI)

- **導覽列透明度**：調整 `site.wallpaper.banner.navbar.transparentMode` 為 `semi`、`full` 或 `semifull`。

- **側邊欄小工具**：在 `sidebar.components` 中重新排序或開關側邊欄元件，如 `profile` (個人資料)、`announcement` (公告)、`categories` (分類)、`tags` (標籤)、`toc` (目錄) 以及 `statistics` (統計)。


## Markdown 擴充語法

### GitHub 儲存庫卡片

您可以新增連結至 GitHub 儲存庫的動態卡片，在頁面載入時，會從 GitHub API 擷取儲存庫資訊。

::github{repo="Spr-Aachen/Twilight"}

使用程式碼 `::github{repo="Spr-Aachen/Twilight"}` 建立 GitHub 儲存庫卡片。

```markdown
::github{repo="Spr-Aachen/Twilight"}
```

### 音樂卡片

- 線上音樂
::music{meting="https://meting.spr-aachen.com/api?server=netease&type=song&id=1390882521"}

```markdown
::music{meting="https://meting.spr-aachen.com/api?server=netease&type=song&id=1390882521"}
```

- 本地音樂
::music{title="深海之息" artist="Youzee Music" cover="https://p1.music.126.net/PhKOqFtljgHDDpKYM2ADUA==/109951169858309716.jpg" audio="assets/music/深海之息.m4a" lrc="assets/music/深海之息.lrc"}

```markdown
::music{title="深海之息" artist="Youzee Music" cover="https://p1.music.126.net/PhKOqFtljgHDDpKYM2ADUA==/109951169858309716.jpg" audio="assets/music/深海之息.m4a" lrc="assets/music/深海之息.lrc"}
```

### 提示區塊 (Admonitions)

支援以下類型的提示區塊：`note`、`tip`、`important`、`warning`、`caution`

:::note
反白顯示使用者應該注意的資訊，即使是在快速瀏覽時。
:::

:::tip
幫助使用者更成功的選擇性資訊。
:::

:::important
使用者成功完成任務所需的關鍵資訊。
:::

:::warning
由於潛在風險，需要使用者立即注意的關鍵內容。
:::

:::caution
某個操作可能帶來的負面後果。
:::

- **基本語法**

    ```markdown
    :::note
    反白顯示使用者應該注意的資訊，即使是在快速瀏覽時。
    :::

    :::tip
    幫助使用者更成功的選擇性資訊。
    :::
    ```

- **自訂標題**

    可以自訂提示區塊的標題。
    :::note[我的自訂標題]
    這是一個帶有自訂標題的筆記。
    :::
    ```markdown
    :::note[我的自訂標題]
    這是一個帶有自訂標題的筆記。
    :::
    ```

- **GitHub 語法**

    > [!TIP]
    > 系統也支援 [GitHub 語法](https://github.com/orgs/community/discussions/16925)。
    ```markdown
    > [!TIP]
    > 系統也支援 GitHub 語法。
    ```

- **防雷標籤 (Spoiler)**

    您可以在文字中加入防雷標籤。文字也支援 **Markdown** 語法。

    這段內容 :spoiler[被隱藏起來了 **欸嘿**]！
    ```markdown
    這段內容 :spoiler[被隱藏起來了 **欸嘿**]！
    ```

---

如需更多詳情，請查看[官方文件](https://docs.twilight.spr-aachen.com)。