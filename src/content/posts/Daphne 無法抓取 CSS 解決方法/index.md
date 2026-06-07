---
title: Daphne 無法抓取 CSS 解決方法
published: 2024-11-24
description: "本文介紹了如何解決在使用 Daphne 部署 Django 應用時靜態文件無法正常加載的問題，特別是如何使用 WhiteNoise 來提供靜態文件支援。"
cover: "https://img.stackpenguin.com/images/Daphne%20%E7%84%A1%E6%B3%95%E6%8A%93%E5%8F%96%20CSS%20%E8%A7%A3%E6%B1%BA%E6%96%B9%E6%B3%95/whitenoise-configuration.jpg"
coverInContent: false
tags:
  - Python Django
  - Daphne
  - 靜態文件
  - WebSocket
  - 部署
category: Python
draft: false
---

## 背景

Daphne 是用於運行 Django ASGI 應用的伺服器。它主要負責處理 WebSocket 和 HTTP 請求，但 Daphne 本身不直接提供靜態文件服務（如 CSS、JS）。這通常導致在使用 Daphne 部署 Django 應用時，訪問 `/static/` 路徑返回 404 錯誤。

---

## 問題現象

當使用 Daphne 啟動應用並訪問 Django 的後台管理介面或靜態頁面時，靜態文件無法正常加載，終端可能顯示以下錯誤：

```jsx
Not Found: /static/admin/css/login.css
Not Found: /static/admin/css/base.css
```

---

## 問題原因

Daphne 不處理靜態文件。Django 預設需要 `collectstatic` 將所有靜態文件集中到一個目錄，並需要一個伺服器（如 WhiteNoise 或 Nginx）來提供靜態文件支援。

---

## 解決方法

### 方法 1：使用 WhiteNoise 提供靜態文件

WhiteNoise 是一個用於提供靜態文件的中介軟體，適合簡單的部署需求。

### 步驟 1：安裝 WhiteNoise

在虛擬環境中安裝 WhiteNoise：

```bash
pip install whitenoise
```

### 步驟 2：配置 WhiteNoise

修改你的 `settings.py` 文件，添加以下配置：

1. **啟用 WhiteNoise 中介**

   ```python
   MIDDLEWARE = [
       'django.middleware.security.SecurityMiddleware',
       'whitenoise.middleware.WhiteNoiseMiddleware',  # 添加這一行
       'django.contrib.sessions.middleware.SessionMiddleware',
       'django.middleware.common.CommonMiddleware',
       'django.middleware.csrf.CsrfViewMiddleware',
       'django.contrib.auth.middleware.AuthenticationMiddleware',
       'django.contrib.messages.middleware.MessageMiddleware',
       'django.middleware.clickjacking.XFrameOptionsMiddleware',
   ]
   ```

2. **設定 `STATIC_ROOT` 和 `STATICFILES_STORAGE`**

   ```python
   STATIC_URL = '/static/'
   STATIC_ROOT = BASE_DIR / 'staticfiles'  # 靜態文件的集中目錄

   # 啟用壓縮和快取
   STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
   ```

### 步驟 3：收集靜態文件

執行以下命令，將所有靜態文件收集到 `STATIC_ROOT` 指定的目錄：

```bash
python manage.py collectstatic
```

### 步驟 4：啟動應用

使用 Daphne 啟動應用：

```bash
daphne -b 127.0.0.1 -p 8000 classify.asgi:application
```

訪問應用後，確認靜態文件是否正常加載。

