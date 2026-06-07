---
title: HackHub 實戰紀錄 - 密碼解密與資料庫爆破
published: 2026-06-07
description: "在這篇 HackHub 實戰紀錄中，我們將練習密碼解密、資料庫爆破等技巧，以提高資訊安全認知。"
cover: "https://img.stackpenguin.com/images/HackHub%20%E5%AF%A6%E6%88%B0%E7%B4%80%E9%8C%84%20-%20%E5%AF%86%E7%A2%BC%E8%A7%A3%E5%AF%86%E8%88%87%E8%B3%87%E6%96%99%E5%BA%AB%E7%88%86%E7%A0%B4/hackhub-password-cracking.jpg"
coverInContent: false
tags:
  - openssl
  - ftp
  - nmap
  - hydra
  - 滲透測試
category: HackHub
draft: false
---

在這篇 HackHub（一款 Steam 上的資訊安全模擬遊戲）實戰紀錄中，我們將練習一系列的 <mark>資訊收集</mark>、<mark>字串解密</mark>、<mark>遠端 FTP 存取</mark>，以及使用 <mark>hydra</mark> 對資料庫服務進行 <mark>密碼爆破</mark> 的流程。

## 1. 資訊收集：WHOIS 查詢與字串解密

首先，我們針對目標網域進行 `whois` 查詢，取得聯絡人資訊。接著，我們發現了一串疑似編碼過的密碼字串。在嘗試使用 `base64 -d` 失敗後，我們查看了 `help` 指令列表，決定安裝 <mark>openssl</mark> 套件來進行解密。

```shell
$ whois occasional-behest.biz
Whois results:

Domain Name: OCCASIONAL-BEHEST.BIZ
Contact Name: Mrs. Willie Legros
Contact Mail: Kaylee.Jast@yahoo.com
Status: ACTIVE

$ echo "TXkgYmFuayBwYXNzd29yZDogUkRZY1pjV3B2UDd2ejdS" | base64 -d
Command "echo "TXkgYmFuayBwYXNzd29yZDogUkRZY1pjV3B2UDd2ejdS" | base64 -d" not found.

$ apt-get install openssl
Reading package lists... Done
Building dependency tree
Reading state information... Done
Installing package...
[##############################] %100.00
The following NEW packages will be installed: openssl

$ openssl -dec TXkgYmFuayBwYXNzd29yZDogUkRZY1pjV3B2UDd2ejdS
Decrypted text: "My bank password: RDYcZcWpvP7vz7R"
```

成功解密出密碼為 <mark>RDYcZcWpvP7vz7R</mark>。

## 2. 遠端存取：連接 FTP 伺服器並取得機密檔案

取得了目標的連線資訊與密碼後，我們使用 `ftp` 指令連線至遠端伺服器，並在 `secret` 資料夾中找到了一份包含 <mark>信用卡資訊</mark> 的機密檔案。

```shell
$ ftp -h 202.9.247.52 -u Grzegorz_Langat25 -p 6VDO9Sxywv9rCKF
Connecting...

ftp> ls
pictures	secret

ftp> cd secret
ftp> ls
credit_card.txt

ftp> cat credit_card.txt
Full name: Takashi Guðmundsson, Card number: 7871 3481 3087 5762, exp: 11/26, cvv: 641

ftp> exit
Disconnected ftp server.
```

## 3. 掃描目標網路服務

接下來，我們鎖定另一個網域，透過 `nslookup` 找出其真實 IP 位址，並使用 `nmap` 進行連接埠掃描。掃描結果顯示該主機的 <mark>3306 埠</mark>（<mark>資料庫服務</mark>）對外開放。

```shell
$ nslookup eager-disguise.name
Server: eager-disguise.name
Address: 4.6.3.176

$ nmap 4.6.3.176
Starting Nmap 7.70 ( https://nmap.org ) at 2026-06-07 13:11
Host is down (0.53059s latency).

PORT	STATE	SERVICE
21	CLOSE	ftp
80	CLOSE	http
3306	OPEN	database
8080	CLOSE	http-proxy
```

## 4. 暴力破解資料庫登入密碼

針對開放的 <mark>資料庫服務</mark>，我們安裝了密碼爆破工具 <mark>hydra</mark>。在嘗試調整參數格式後，成功搭配本地端的字典檔（`wordlist.lst`）破解出登入憑證。

```shell
$ apt-get install hydra
Reading package lists... Done
Building dependency tree
Reading state information... Done
Installing package...
[##############################] %100.00
The following NEW packages will be installed: hydra

$ hydra -T 4.6.3.176:3306 -P /home/stackpenguin/desktop/wordlist.lst
Hydra v7.6 (c)2013 by van Hauser/THC & David Maciejak - for legal purposes only
Hydra (http://www.thc.org/thc-hydra) starting at 2026-06-07 13:16:05

[DATA] 6 tasks, 1 server, 13977 login tries user (guest), ~14713 tries per task
[DATA] attacking service ssh on target 4.6.3.176:3306

Login information matched!
+-------+----------+
| USER  | PASSWORD |
+-------+----------+
| guest | barefoot |
+-------+----------+
```

最終成功取得了資料庫的存取權限：帳號 <mark>guest</mark>、密碼 <mark>barefoot</mark>。
