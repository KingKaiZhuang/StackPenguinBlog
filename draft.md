---
title: WordPress VPS 初始安全、Docker Traefik 與 Gmail API 寄信設定教學
date: 2026-07-12
tags:
  - WordPress
  - Docker
  - Traefik
  - Gmail API
  - VPS
categories:
  - vm-setting
---

這篇文章整理的是一次 WordPress VPS 初始設定的實作流程。重點不是把每個指令背起來，而是建立一個比較穩的順序：先把主機管理入口整理好，再處理 Docker 與 WordPress，最後設定寄信與 2FA。

文章中的網域、帳號、專案名稱都用範例代稱，請依照自己的環境替換。不要把真實 IP、密碼、OAuth Client Secret、資料庫密碼或完整主機資訊寫進公開文章。

## 適用情境

這份流程適合：

- VPS 使用 Ubuntu 24.04 LTS。
- WordPress 跑在 Docker container 裡。
- 前方使用 Traefik 作為 reverse proxy。
- 需要讓 WordPress 可以穩定寄信。
- 想要啟用 2FA，但不希望因為 Email code 收不到而被鎖在後台外面。

大致架構如下：

```text
訪客
  -> HTTPS
  -> Traefik
  -> WordPress container
  -> MySQL container
```

## 一、先更新系統套件

剛建立 VPS 後，第一步先更新系統套件：

```bash
sudo apt update
sudo apt upgrade -y
```

如果更新過程中有 Docker 或 container runtime 相關套件更新，完成後可以檢查 container 是否仍正常運作：

```bash
sudo docker ps
```

這一步的目標只是讓系統先站在最新狀態，不要急著改 SSH、防火牆或 Docker compose。

## 二、建立一般管理帳號

不要長期使用 `root` 直接管理主機。可以建立一個一般使用者，再加入 `sudo` 群組：

```bash
sudo adduser your-user
sudo usermod -aG sudo your-user
```

確認使用者權限：

```bash
id your-user
getent group sudo
```

之後日常管理都使用這個帳號登入，再透過 `sudo` 執行管理指令。

## 三、設定 SSH key 登入

在自己的電腦產生 SSH key：

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

把 public key 放到 VPS 的管理帳號：

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub your-user@your-server
```

接著開一個新的終端機測試：

```bash
ssh your-user@your-server
sudo whoami
```

如果 `sudo whoami` 回傳：

```text
root
```

代表這個帳號已經可以正常登入與管理主機。

## 四、強化 SSH 設定

在確認 SSH key 登入成功之前，不要急著關閉密碼登入。確認新帳號可以登入後，再建立 SSH 設定備份：

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%Y%m%d-%H%M%S)
```

建議新增一個獨立設定檔：

```bash
sudo nano /etc/ssh/sshd_config.d/01-hardening.conf
```

內容如下：

```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

套用前先檢查語法：

```bash
sudo sshd -t
```

如果沒有任何輸出，代表語法正常。再重啟 SSH：

```bash
sudo systemctl restart ssh
```

最後確認有效設定：

```bash
sudo sshd -T | grep -E '^(port|permitrootlogin|passwordauthentication|pubkeyauthentication)'
```

預期重點是：

```text
permitrootlogin no
passwordauthentication no
pubkeyauthentication yes
```

> [!TIP]
> 改完 SSH 後，不要立刻關掉原本的連線視窗。請另外開一個新視窗確認可以登入，再關掉舊視窗。

## 五、安裝 fail2ban

`fail2ban` 可以監看登入紀錄，當同一來源連續嘗試失敗登入時，暫時封鎖該來源。

```bash
sudo apt install fail2ban -y
sudo systemctl enable --now fail2ban
```

確認服務：

```bash
sudo systemctl status fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

如果看到 `sshd` jail，代表 SSH 防護已啟用。

## 六、確認自動安全更新

Ubuntu 通常可以使用 `unattended-upgrades` 處理安全更新：

```bash
sudo systemctl status unattended-upgrades
```

如果尚未安裝或未啟用：

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure unattended-upgrades
```

## 七、把主機時區改成台灣

如果主要維護者在台灣，建議把 VPS 系統時區改成 `Asia/Taipei`，之後看 log 會比較直覺：

```bash
sudo timedatectl set-timezone Asia/Taipei
timedatectl
date
```

確認看到：

```text
Time zone: Asia/Taipei (CST, +0800)
NTP service: active
```

## 八、理解 Traefik 在架構中的角色

Traefik 是 reverse proxy，可以把外部 HTTPS 流量導向正確的 container。

常見架構是：

```text
外部訪客
  -> 80 / 443
  -> Traefik
  -> WordPress container
```

Traefik 通常負責：

- 接收 HTTP / HTTPS 流量。
- 將 HTTP 轉向 HTTPS。
- 依照網域名稱轉發到正確 container。
- 搭配 Let's Encrypt 管理 SSL 憑證。
- 讓後端 container 不需要各自直接對外公開。

WordPress container 可以透過 labels 告訴 Traefik 要如何代理：

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.wordpress.rule=Host(`your-domain.com`)
  - traefik.http.routers.wordpress.entrypoints=websecure
  - traefik.http.routers.wordpress.tls.certresolver=letsencrypt
  - traefik.http.services.wordpress.loadbalancer.server.port=80
```

## 九、讓 WordPress 只透過 Traefik 進入

如果 WordPress 已經由 Traefik 代理，就不需要再讓 WordPress container 自己發布公開 port。

不建議這樣：

```yaml
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "80"
```

比較建議改成：

```yaml
services:
  wordpress:
    image: wordpress:latest
    expose:
      - "80"
```

差異是：

- `ports`：把 container port 發布到主機外部。
- `expose`：只在 Docker network 內宣告服務 port，讓 Traefik 可以代理。

修改前先備份 compose 檔：

```bash
cd /path/to/wordpress-compose
sudo cp docker-compose.yml docker-compose.yml.bak.$(date +%Y%m%d-%H%M%S)
```

檢查 compose 設定：

```bash
sudo docker compose config
```

確認沒有語法錯誤後再重建：

```bash
sudo docker compose up -d
```

確認 container 狀態：

```bash
sudo docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'
```

WordPress container 應該只顯示內部服務 port，而不是主機公開轉發。

再確認網站仍可透過正式網域存取：

```bash
curl -k -I https://your-domain.com
```

預期可以看到 `HTTP/2 200` 或正常的 HTTPS 回應。

## 十、啟用 UFW 防火牆

啟用防火牆前，先確認目前主機實際監聽的服務：

```bash
sudo ss -tulpn
sudo docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'
```

基本策略是：

- 預設拒絕外部連入。
- 允許主機往外連線。
- 允許 SSH。
- 允許 HTTP / HTTPS。
- 如果雲端平台有必要的管理連線，依官方文件保留。

範例：

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw enable
sudo ufw status verbose
```

> [!NOTE]
> 如果你的 VPS 供應商有自己的管理代理、監控或備份服務，請先確認官方文件需要哪些連線。不要在不了解用途的情況下直接阻擋平台管理所需的連線。

## 十一、WordPress 外掛先保持精簡

剛架好的 WordPress 不建議一次裝很多外掛。最小可用組合通常是：

- SMTP 外掛：讓 WordPress 可以穩定寄信。
- 2FA 外掛：保護管理員登入。
- 表單外掛：如果網站需要聯絡表單再安裝。

不急著安裝：

- 大型安全外掛。
- 快取外掛。
- SEO 外掛。
- 頁面編輯器。

原則很簡單：真的需要再裝，裝完就維護更新。

## 十二、設定 WordPress SMTP

WordPress 後台的「網站管理員電子郵件地址」只是收件地址，不代表 WordPress 已經具備可靠寄信能力。

可以把兩者分開理解：

```text
網站管理員電子郵件地址 = WordPress 要把通知寄給誰
SMTP = WordPress 要怎麼把信寄出去
```

建議安裝 SMTP 外掛，例如：

```text
FluentSMTP
```

如果使用 Gmail 或 Google Workspace，可以選擇 Gmail API / Google Workspace API 的連線方式。這比直接填 Gmail 密碼更適合長期使用。

## 十三、Google Cloud Gmail API 設定

### 1. 建立 Google Cloud 專案

進入 Google Cloud Console：

```text
https://console.cloud.google.com
```

建立新專案，例如：

```text
WordPress Mail
```

### 2. 啟用 Gmail API

到：

```text
APIs & Services -> Library
```

搜尋並啟用：

```text
Gmail API
```

### 3. 設定 OAuth consent screen

到：

```text
APIs & Services -> OAuth consent screen
```

一般 Gmail 帳號通常選：

```text
External
```

如果是 Google Workspace，而且只給組織內使用，可以選：

```text
Internal
```

基本欄位：

```text
App name: WordPress Mail
User support email: your-email@example.com
Developer contact email: your-email@example.com
```

寄信用途通常只需要 Gmail send 權限：

```text
https://www.googleapis.com/auth/gmail.send
```

如果 OAuth app 還在 Testing，請把自己要授權的 Google 帳號加入 Test users。

### 4. 建立 OAuth Client

到：

```text
APIs & Services -> Credentials -> Create Credentials -> OAuth client ID
```

Application type 選：

```text
Web application
```

Authorized JavaScript origins 填網站根網域：

```text
https://your-domain.com
```

Authorized redirect URIs 必須填 SMTP 外掛顯示的完整 redirect URI。不要自己猜，請從 FluentSMTP 畫面複製。

格式通常會像：

```text
https://your-domain.com/wp-admin/...
```

建立完成後，把：

```text
Client ID
Client Secret
```

貼回 FluentSMTP 的 Google / Gmail API 設定中。

### 5. 授權並發送測試信

回到 WordPress 後台：

```text
Settings -> FluentSMTP
```

連接 Google 帳號後，先發送測試信。成功後再測：

- WordPress 忘記密碼信。
- WooCommerce 通知信。
- 聯絡表單通知信。

## 十四、redirect_uri_mismatch 的處理方式

如果 Google 授權時看到：

```text
Error 400: redirect_uri_mismatch
```

通常代表 Google Cloud 的 OAuth Client 沒有填到外掛實際送出的 redirect URI。

處理方式：

1. 在錯誤頁面打開錯誤詳細資料。
2. 找到 `redirect_uri`。
3. 複製完整網址。
4. 回 Google Cloud 的 OAuth Client。
5. 貼到 Authorized redirect URIs。
6. 儲存後等待一小段時間，再重新授權。

注意，這裡不能只填網站根網域。redirect URI 必須完整一致，包含路徑與參數。

## 十五、重新啟用 2FA

SMTP 測試成功後，再啟用 2FA 外掛。管理員帳號建議使用：

```text
Authenticator App (TOTP)
Backup Codes
```

Email code 可以當備用，但不要當唯一方法。原因是 Email 本身可能受到 SMTP 設定、信箱延遲、垃圾信規則或 OAuth 授權狀態影響。

重新啟用 2FA 後，先不要急著登出。請照順序檢查：

1. 產生並保存 backup codes。
2. 使用無痕視窗測試登入。
3. 確認 TOTP 可以登入。
4. 確認 SMTP 測試信仍正常。

## 十六、公開文章不要放的資訊

如果要把架站紀錄整理成公開文章，建議避免放：

- 真實伺服器 IP。
- 真實主機名稱。
- 管理入口網址。
- SSH 使用者名稱。
- 完整防火牆規則中與平台管理相關的特殊連線。
- 資料庫帳號、密碼、環境變數。
- OAuth Client Secret。
- 完整 `docker compose config` 輸出，因為它可能展開環境變數。
- 可直接識別站台後台或管理路徑的截圖。

文章可以保留的是：

- 架構觀念。
- 泛用指令。
- 設定順序。
- 常見錯誤與排查方向。
- 安全設定的目的。

## 總結

這次 WordPress VPS 初始設定的核心順序是：

```text
系統更新
-> 建立一般管理帳號
-> SSH key 登入
-> 關閉 root 與密碼 SSH 登入
-> fail2ban
-> Docker / Traefik 架構整理
-> WordPress 不直接對外發布 container port
-> UFW 防火牆
-> SMTP
-> 2FA
```

最容易出錯的地方通常不是單一指令，而是順序。尤其是 SSH 與 2FA，都應該先確認替代登入方式可用，再關閉舊的登入方式。這樣才不會把自己鎖在系統或 WordPress 後台外面。
