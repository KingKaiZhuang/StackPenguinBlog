---
title: 如何在 Linode 用 Docker 架設 n8n
published: 2025-11-05
description: "這篇文章詳盡介紹如何在 Linode 上使用 Docker 架設 n8n，涵蓋了每一步驟及潛在錯誤的解決方式，並講解了如何通過 Cloudflare Tunnel 提供安全的 HTTPS 連接。"
cover: "https://img.stackpenguin.com/images/%E5%A6%82%E4%BD%95%E5%9C%A8%20Linode%20%E7%94%A8%20Docker%20%E6%9E%B6%E8%A8%AD%20n8n/cloudflare-tunnel-diagram.jpg"
coverInContent: false
tags:
  - Docker
  - n8n
  - Cloudflare
  - VM設定
  - 部署
category: 技術
draft: false
---

下面是**整趟 n8n on Linode + Cloudflare Tunnel 部署旅程完整總整理**  
包含每一步、每個踩雷點、每個修法。

## Linode 上部署：

- Docker + Docker Compose

- n8n with persistent volume

- Cloudflare Tunnel (免開 port、HTTPS、domain)

- 安全保護（BasicAuth）

最終網址 : https://n8n.stackpenguin.com (根據你自己的網域)

## 系統前置

### SSH 進 Linode → 更新

```
sudo apt update && sudo apt upgrade -y
```

```
sudo apt update && sudo apt upgrade -y
```

## 安裝 Docker & Compose（先確認再裝）

### 檢查 Docker

```
docker --version
```

```
docker --version
```

### 沒有就安裝

```
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER
```

```
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER
```

### 檢查 Compose

```
docker-compose --version
```

```
docker-compose --version
```

### 沒有就安裝

```
sudo apt install docker-compose -y
```

```
sudo apt install docker-compose -y
```

## 建立 n8n 工作資料夾

```
mkdir -p ~/n8n
cd ~/n8n
```

```
mkdir -p ~/n8n
cd ~/n8n
```

## 建立 docker-compose.yml

> 一開始你用 docker run，後來換 compose（正確）

```
version: "3.3"

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    container_name: n8n
    environment:
      - GENERIC_TIMEZONE=Asia/Taipei
      - TZ=Asia/Taipei
      - N8N_PORT=5678
      - N8N_HOST=n8n.stackpenguin.com
      - N8N_EDITOR_BASE_URL=https://n8n.stackpenguin.com

      # secure login
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=orcajunkai
      - N8N_BASIC_AUTH_PASSWORD=<你的密碼>

    ports:
      - "5678:5678"
    volumes:
      - ./data:/home/node/.n8n
    restart: unless-stopped
```

```
version: "3.3"

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    container_name: n8n
    environment:
      - GENERIC_TIMEZONE=Asia/Taipei
      - TZ=Asia/Taipei
      - N8N_PORT=5678
      - N8N_HOST=n8n.stackpenguin.com
      - N8N_EDITOR_BASE_URL=https://n8n.stackpenguin.com

      # secure login
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=orcajunkai
      - N8N_BASIC_AUTH_PASSWORD=<你的密碼>

    ports:
      - "5678:5678"
    volumes:
      - ./data:/home/node/.n8n
    restart: unless-stopped
```

> ⚠️ 關鍵：**不能放 `N8N_PROTOCOL=https`**（那會 crash）

記得要將防火牆設定允許

```
orcajunkai@localhost:~$ sudo ufw allow 5678
Rule added
Rule added (v6)
orcajunkai@localhost:~$ sudo ufw reload
Firewall reloaded
```

```
orcajunkai@localhost:~$ sudo ufw allow 5678
Rule added
Rule added (v6)
orcajunkai@localhost:~$ sudo ufw reload
Firewall reloaded
```

## 啟動 n8n

```
docker-compose up -d
docker ps
curl http://localhost:5678
```

```
docker-compose up -d
docker ps
curl http://localhost:5678
```

## Cloudflare Tunnel 登入

### 安裝 cloudflared

```
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

```
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### 登入

```
cloudflared tunnel login
```

```
cloudflared tunnel login
```

![](https://img.stackpenguin.com/images/%E5%A6%82%E4%BD%95%E5%9C%A8%20Linode%20%E7%94%A8%20Docker%20%E6%9E%B6%E8%A8%AD%20n8n/image-1-1024x557.jpg)

* * *

## 建 tunnel

```
cloudflared tunnel create n8n
```

```
cloudflared tunnel create n8n
```

取得 UUID

## 建 DNS mapping

```
cloudflared tunnel route dns n8n n8n.stackpenguin.com
```

```
cloudflared tunnel route dns n8n n8n.stackpenguin.com
```

## 建 Cloudflare config

```
sudo nano /etc/cloudflared/config.yml
```

```
sudo nano /etc/cloudflared/config.yml
```

貼：

```
tunnel: <UUID>
credentials-file: /home/orcajunkai/.cloudflared/<UUID>.json

ingress:
  - hostname: n8n.stackpenguin.com
    service: http://localhost:5678
  - service: http_status:404

```

```
tunnel: <UUID>
credentials-file: /home/orcajunkai/.cloudflared/<UUID>.json

ingress:
  - hostname: n8n.stackpenguin.com
    service: http://localhost:5678
  - service: http_status:404
```

## 啟動 Tunnel

```
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
systemctl status cloudflared
```

```
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
systemctl status cloudflared
```

## 遇到的問題 & 解決

| Issue | 解析 | 解法 |
| --- | --- | --- |
| 反引號 \` 在 Ubuntu 不能用 | Windows copy 的 shell | Linux 用 `\` 換行 |
| Tunnel 502 | config path / hostname / protocol 錯 | 修 `config.yml` |
| `UUID.json` not found | `<UUID>` 沒替換 | 改成真 UUID |
| `curl localhost:5678` failed | n8n crash | remove HTTPS env |
| `EACCES /home/node/.n8n/config` | volume 權限不對 | `chown 1000:1000 data/` |
| container restart loop | wrong env / permissions | Fix compose & folder perms |
| Everyone can access n8n | 公開服務 | 啟 basic auth env |

## 最後驗證

```
orcajunkai@localhost:~/n8n$ curl http://localhost:5678
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /</pre>
</body>
</html>
```

```
orcajunkai@localhost:~/n8n$ curl http://localhost:5678
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /</pre>
</body>
</html>
```

Browser：https://n8n.stackpenguin.com (自己的網域)

跳出 BasicAuth → Login → 看到 n8n UI ✅

![](https://img.stackpenguin.com/images/%E5%A6%82%E4%BD%95%E5%9C%A8%20Linode%20%E7%94%A8%20Docker%20%E6%9E%B6%E8%A8%AD%20n8n/-------2025-11-05-163916-1024x606.jpg)

## Cloudflared 運作原理

你想知道為啥：

```
https://n8n.stackpenguin.com

可以指到你 Linode 上的 n8n
而且你 沒有開 5678 port、也沒有裝 Nginx/Certbot
卻 magically 有 HTTPS + domain？
```

## 🔥 Cloudflare Tunnel 的核心概念

平常網站流程是：

```
User → Domain → Public IP → Server → App (n8n)
```

但 Cloudflare Tunnel 是：

```
User → Cloudflare → Tunnel → Your Server → n8n
```

你的 server 變成**主動連 Cloudflare**，不是 Cloudflare 來找你

這樣：

- 不用開 Port 80/443/5678

- 不用裝 Nginx

- 不用 SSL cert

- 網路封死也能連

超安全又 chill 這就是為什麼 tunnel 是超熱門 DevOps meta hack

## 那「綁定網址」到底做了什麼？

你做了兩件事：

### 1\. Cloudflare DNS 建立 Route

這條指令：

```
cloudflared tunnel route dns n8n n8n.stackpenguin.com
```

```
cloudflared tunnel route dns n8n n8n.stackpenguin.com
```

意思：  
**讓 n8n.stackpenguin.com 指向這條 Cloudflare Tunnel**

Cloudflare 幫你塞一條 CNAME 到 DNS：

```
n8n.stackpenguin.com → <Cloudflare Tunnel endpoint>

不是指向你的 Linode IP
是指向 Cloudflare 的 secure gateway
```

### 2\. Tunnel config 說「這 domain 對應這 app」

你的 `/etc/cloudflared/config.yml`

```
ingress:
  - hostname: n8n.stackpenguin.com
    service: http://localhost:5678
```

```
ingress:
  - hostname: n8n.stackpenguin.com
    service: http://localhost:5678
```

意思：

> 有人打 `n8n.stackpenguin.com`  
> → Cloudflare 收 request  
> → 丟給 Tunnel  
> → Tunnel 轉給你 Linode  
> → 你的 n8n 回應

完全不露 IP  
完全不需要開 Port  
完全不需要 TLS 憑證

* * *

## 一句話版本

Cloudflare Tunnel 把你 server 變成：

> **末端加密節點**

Cloudflare 當你的「外部大門 + HTTPS + Firewall」  
你 server 只是「內部房間」

所以 `https://n8n.stackpenguin.com` 是 Cloudflare 給 HTTPS  
不是你自己做 HTTPS

## 骨架圖（秒懂）

```
🌍 User Browser
      ↓ https://n8n.stackpenguin.com
Cloudflare Edge (SSL / Firewall / CDN)
      ↓ Tunnel (Secure connection)
Linode VM
      ↓ localhost:5678
n8n dashboard
```

```
🌍 User Browser
      ↓ https://n8n.stackpenguin.com
Cloudflare Edge (SSL / Firewall / CDN)
      ↓ Tunnel (Secure connection)
Linode VM
      ↓ localhost:5678
n8n dashboard
```

## 現在有什麼？

已經跑在：

💠 Cloudflare Zero Trust Tunnel  
💠 隱藏原始 IP  
💠 強制 HTTPS  
💠 密碼保護 (Basic Auth)  
💠 沒開任何 external port（最安全）

你走的不是傳統 Web Hosting  
你走的是 **Zero Trust Architecture**

