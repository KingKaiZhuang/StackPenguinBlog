---
title: Line Bot 與 Chatgpt應用 02 - 執行程式
published: 2024-09-26
description: "本教學將帶領你使用 Replit 平台運行由 GPT 支援的 Line Bot，並逐步指導你如何設定和執行這個 Python 程式碼。"
cover: "https://img.stackpenguin.com/images/Line%20Bot%20%E8%88%87%20Chatgpt%E6%87%89%E7%94%A8%2002%20-%20%E5%9F%B7%E8%A1%8C%E7%A8%8B%E5%BC%8F/replit-python-execution.jpg"
coverInContent: false
tags:
  - Line Bot
  - GPT
  - Replit
  - Python
  - 開發
category: Line Bot
draft: false
---

# Line Bot 和 GPT 實戰教學

本教學將帶領你使用 Replit 平台運行由 GPT 支援的 Line Bot，並逐步指導你如何設定和執行這個 Python 程式碼。

## 步驟 1: 進入 Replit 並複製專案

首先，進入 Replit 上的大神已經寫好的 Python 程式碼頁面。

[![Replit Python 程式碼](https://firebasestorage.googleapis.com/v0/b/zhuang-afef4.appspot.com/o/KingKaiZhuang.github.io%2FLine-Bot%E5%92%8Cgpt%E5%AF%A6%E6%88%B0%E6%95%99%E5%AD%B8%2Freplit-python%2Freplit-python1.png?alt=media&token=55d33712-10f8-4ecb-a4f9-efa01177c7c1)](https://firebasestorage.googleapis.com/v0/b/zhuang-afef4.appspot.com/o/KingKaiZhuang.github.io%2FLine-Bot%E5%92%8Cgpt%E5%AF%A6%E6%88%B0%E6%95%99%E5%AD%B8%2Freplit-python%2Freplit-python1.png?alt=media&token=55d33712-10f8-4ecb-a4f9-efa01177c7c1)

點擊以下連結，進入 Replit 上的專案頁面並進行複製 (fork) 到你自己的工作區：

[GPTDev_LINE_bot - Replit](https://replit.com/@uncletieke/GPTDevLINEbot)

## 步驟 2: 複製專案到自己的工作區

點擊 "Fork" 按鈕將專案複製到你的 Replit 帳戶中：

[![Fork 按鈕](https://firebasestorage.googleapis.com/v0/b/zhuang-afef4.appspot.com/o/KingKaiZhuang.github.io%2FLine-Bot%E5%92%8Cgpt%E5%AF%A6%E6%88%B0%E6%95%99%E5%AD%B8%2Freplit-python%2Freplit-python2.png?alt=media&token=ec3babd7-6fbd-4559-ae12-0678b9651292)](https://firebasestorage.googleapis.com/v0/b/zhuang-afef4.appspot.com/o/KingKaiZhuang.github.io%2FLine-Bot%E5%92%8Cgpt%E5%AF%A6%E6%88%B0%E6%95%99%E5%AD%B8%2Freplit-python%2Freplit-python2.png?alt=media&token=ec3babd7-6fbd-4559-ae12-0678b9651292)

## 步驟 3: 設定環境變數

在 Replit 的專案設定中，輸入以下三個環境變數：

- `LINE_SECRET`：你在 Line 開發者後台取得的 Secret
- `LINE_TOKEN`：你在 Line 開發者後台取得的 Token
- `OPENAI_API_KEY`：你從 OpenAI 取得的 API Key

如圖所示：

[![環境變數設定](https://firebasestorage.googleapis.com/v0/b/zhuang-afef4.appspot.com/o/KingKaiZhuang.github.io%2FLine-Bot%E5%92%8Cgpt%E5%AF%A6%E6%88%B0%E6%95%99%E5%AD%B8%2Freplit-python%2Freplit-python3.png?alt=media&token=42bc5756-6ab9-4447-b3d8-dc7f0445fcca)](https://firebasestorage.googleapis.com/v0/b/zhuang-afef4.appspot.com/o/KingKaiZhuang.github.io%2FLine-Bot%E5%92%8Cgpt%E5%AF%A6%E6%88%B0%E6%95%99%E5%AD%B8%2Freplit-python%2Freplit-python3.png?alt=media&token=42bc5756-6ab9-4447-b3d8-dc7f0445fcca)

> **提示**: 如果你不知道如何取得這三個值，請私訊我以獲得幫助。

## 步驟 4: 執行專案

設定好環境變數後，點擊 "Run" 按鈕來執行程式。

[![執行專案](https://firebasestorage.googleapis.com/v0/b/zhuang-afef4.appspot.com/o/KingKaiZhuang.github.io%2FLine-Bot%E5%92%8Cgpt%E5%AF%A6%E6%88%B0%E6%95%99%E5%AD%B8%2Freplit-python%2Freplit-python5.png?alt=media&token=bb70af8f-177f-438f-a869-5c18eee774ff)](https://firebasestorage.googleapis.com/v0/b/zhuang-afef4.appspot.com/o/KingKaiZhuang.github.io%2FLine-Bot%E5%92%8Cgpt%E5%AF%A6%E6%88%B0%E6%95%99%E5%AD%B8%2Freplit-python%2Freplit-python5.png?alt=media&token=bb70af8f-177f-438f-a869-5c18eee774ff)

## 完成

恭喜你，現在你的 Line Bot 已經與 GPT 整合並運行成功了！你可以開始與你的 Bot 互動，並根據需求進行進一步的開發。

