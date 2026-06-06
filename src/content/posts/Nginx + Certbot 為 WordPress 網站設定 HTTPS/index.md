---
title: Nginx + Certbot 為 WordPress 網站設定 HTTPS
published: 2025-03-30
description: "本教學將說明如何透過 Certbot 申請 Let's Encrypt 免費 SSL 憑證，並整合至 Nginx，成功為你的 WordPress 網站啟用 HTTPS。"
cover: "https://pub-a50030fee9b441a489c4fba183ba46d0.r2.dev/images/Nginx%20%2B%20Certbot%20%E7%82%BA%20WordPress%20%E7%B6%B2%E7%AB%99%E8%A8%AD%E5%AE%9A%20HTTPS/nginx-certbot-https.jpg"
coverInContent: false
tags:
  - Nginx
  - Certbot
  - WordPress
  - SSL
  - HTTPS
category: vm-setting
draft: false
---

本教學將說明如何透過 Certbot 申請 Let's Encrypt 免費 SSL 憑證，並整合至 Nginx，成功為你的 WordPress 網站啟用 HTTPS。

## 📌 前置準備

1. 網站程式碼已部署於 `/var/www/你的網站資料夾`

3. 網域名稱（例如 `yourdomain.com`）已正確指向你的伺服器 IP

5. 已安裝 Nginx、PHP-FPM、Certbot

* * *

## 步驟一：建立 Nginx 設定檔

使用 `nano` 編輯對應網域的 Nginx 設定檔：

```
sudo nano /etc/nginx/sites-available/yourdomain.com
```

Bash

設定內容範例如下（HTTPS 區塊會由 Certbot 自動補上）：

```
server {
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/你的網站資料夾;
    index index.php index.html;

    access_log /var/log/nginx/yourdomain.access.log;
    error_log  /var/log/nginx/yourdomain.error.log;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.yourdomain.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = yourdomain.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 404; # managed by Certbot
}
```

Bash

啟用站點：

```
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/

ps: 注意你的fastcgi_pass php 版本要對應 例如我是php8.3-fpm.sock
```

* * *

## 步驟二：使用 Certbot 啟用 HTTPS

使用以下指令安裝 SSL 憑證並自動設定 Nginx：

```
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

```
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Bash

若成功，會出現類似以下訊息：

```
Successfully deployed certificate for yourdomain.com to /etc/nginx/sites-enabled/yourdomain.com
...
Congratulations! You have successfully enabled HTTPS on https://yourdomain.com
```

```
Successfully deployed certificate for yourdomain.com to /etc/nginx/sites-enabled/yourdomain.com
...
Congratulations! You have successfully enabled HTTPS on https://yourdomain.com
```

Bash

* * *

## 步驟三：檢查 Nginx 設定

確認設定檔是否正確：

```
sudo nginx -t
```

```
sudo nginx -t
```

Bash

重新載入 Nginx：

```
sudo systemctl reload nginx
```

```
sudo systemctl reload nginx
```

Bash

* * *

## 步驟四：確認 HTTPS 連接埠（443）已開啟

檢查 443 port 是否啟用中：

```
sudo ss -tulpn | grep ':443'
```

```
sudo ss -tulpn | grep ':443'
```

Bash

若防火牆未開啟 443，請加入防火牆規則：

```
sudo ufw allow 443
sudo ufw reload
```

```
sudo ufw allow 443
sudo ufw reload
```

Bash

可再次確認 UFW 狀態：

```
sudo ufw status
```

```
sudo ufw status
```

Bash

* * *

## 步驟五：確認網站正常運作

瀏覽器開啟：

1. [**https://yourdomain.com**](https://yourdomain.com/)

3. [https://www.yourdomain.com](https://www.yourdomain.com/)

應顯示 WordPress 首頁，且網址列應顯示鎖頭圖示（HTTPS 已啟用）。

* * *

## ✅ 補充資訊

- Certbot 預設會自動排程憑證續期，無需手動干預

- 憑證有效期限為 90 天，自動續期機制會確保不中斷

- 可手動測試續期機制： `sudo certbot renew --dry-run`

