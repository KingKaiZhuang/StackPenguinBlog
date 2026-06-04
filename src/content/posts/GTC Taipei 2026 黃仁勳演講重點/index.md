---
title: GTC Taipei 2026 黃仁勳演講重點
published: 2026-06-04
description: "本文深入分析 NVIDIA 執行長黃仁勳在最近演講中提到的五大重點，包括代理型 AI、Vera CPU、企業級代理工具包、PC 產業的未來以及實體 AI 的深層佈局等。"
cover: "./gtc-taipei-2026-keynote.jpg"
coverInContent: false
tags:
  - NVIDIA
  - AI
  - 代理型 AI
  - Vera CPU
  - 自駕車
category: 科技
draft: false
---

在近期的演講中，NVIDIA 執行長黃仁勳深入拆解了輝達未來的技術藍圖與願景。本文整理了這場演講的核心五大重點，帶你快速了解從 <mark>Agentic AI</mark> 到 <mark>次世代硬體架構</mark> 的發展趨勢。

### 1. <mark>代理型 AI</mark> (Agentic AI) 的運作機制與經濟效益
*   **Agent (代理) 的組成**：傳統的運算模式是應用程式在作業系統中運行，而未來的 <mark>Agent</mark> 則是由「大型語言模型（負責思考）」加上一個「控制台/外掛架構 (Harness)」所組成。
*   **強大的記憶與工具使用能力**：這個架構能夠管理 <mark>Agent</mark> 的短期記憶（工作記憶）與長期記憶。它能理解、觀察、推理、制定計畫，並**自主使用工具**（例如試算表、網路瀏覽器、資料庫引擎）來完成具生產力的工作。
*   **算力即營收**：對產業界而言，現在 AI 產生的每一個「<mark>Token</mark>（詞彙標記）」都是能夠創造獲利與營收的單位 (Profitable units of revenues)。因為有利可圖，企業會想要建立更多的 AI 工廠來生成 <mark>Token</mark>，這正是運算需求暴增、台灣供應鏈如此忙碌的根本原因。

### 2. <mark>Vera Rubin</mark> 基礎設施與 <mark>Vera CPU</mark> 的極致細節
*   **不僅是 GPU，而是巨大基礎設施**：<mark>Vera Rubin</mark> 是 NVIDIA 史上最具野心的計畫，動用四萬名工程師參與。它不是單一晶片，而是包含 <mark>Vera CPU</mark>、GPU、NVLink 72、Bluefield 儲存與安全系統、CX9 網路，以及 DOA 軟體堆疊的完整系統。所有資料在靜止、傳輸或使用時皆有加密，符合機密運算標準。
*   **<mark>Vera CPU</mark> 是為「沒耐心的 Agent」量身打造**：過去的 CPU 是為人類設計（以秒為單位），但 <mark>Agent</mark> 處理資料的速度是以「奈秒」計算，它們無法忍受等待。
*   **<mark>Vera CPU</mark> 的四大架構特色**：
    1.  **極高的單執行緒效能 (IPC)**：每個時脈週期可獲取、解碼並執行高達 10 個指令，具備世界級的單執行緒效能。
    2.  **核心頻寬**：極致的核心資料傳輸頻寬。
    3.  **整體頻寬**：它是首款採用 PCIe Gen 6 並搭載 1.2 TB/s LPDDR5 記憶體的 CPU，頻寬是目前最高效能 CPU 的兩到三倍。
    4.  **極低延遲**：確保 <mark>Agent</mark> 在存取資料庫或使用工具時能獲得最快的反應時間。

### 3. 企業級 <mark>代理工具包</mark> (NVIDIA Agent Toolkit) 的四大核心
NVIDIA 認為每家公司都會變成「<mark>Agent 公司</mark>」，因此推出專屬工具包，企業只需要具備以下四個要素就能打造超級代理：
1.  **模型 (Models)**：例如開源的 Neotron，企業可以自行修改並作為專屬模型使用。
2.  **控制台架構 (Harness)**：例如 NVIDIA 開源的 **Open Shell**。它能保護 <mark>Agent</mark>，確保資料隱私與資安政策，並決定 <mark>Agent</mark> 的存取權限，目前微軟與 Red Hat 等公司皆已採用。
3.  **工具與技能 (Tools)**：例如 NVIDIA 的 CUDA X 函式庫，讓 <mark>Agent</mark> 具備各種專業技能。
4.  **運作環境 (Runtime)**：能讓 <mark>Agent</mark> 在雲端、企業地端甚至終端設備上完美運行。
*   *應用案例*：NVIDIA 與益華電腦 (Cadence) 合作打造了「晶片設計超級代理 (Chip design super agent)」，只要輸入 RTL 程式碼、架構圖或規格書，它就能協助除錯與設計。

### 4. 聯手微軟與聯發科顛覆 PC 產業
*   **未來的 <mark>PC 作業系統</mark>**：未來的作業系統將是「傳統作業系統 + 大型語言模型」，<mark>LLM</mark> 就像是現代版的 DirectX，成為電腦的智慧延伸，能看、能聽、能生成影音；而傳統的應用程式將被 <mark>Agent</mark> 取代。
*   **聯發科合作的 <mark>N1X 晶片</mark>**：NVIDIA 與聯發科共同打造了這顆號稱「需要 33 年才能開發出來」的超級晶片。它 100% 相容 Windows 應用程式，且能完美運行 NVIDIA 所有的軟體堆疊（包含 CUDA、數位生物學、物理運算、AI 等）。
*   **<mark>RTX Spark</mark> 全新產品線**：發表了涵蓋桌機、筆記型電腦與工作站的全新產品線，獲得全球 100% 的 <mark>PC 產業鏈</mark> 支持，重新定義個人電腦。

### 5. 實體 AI、自駕車與人形機器人的深層佈局
*   **<mark>Cosmos 3</mark> 世界基礎模型**：過去訓練機器人的最大難題，是人類錄製的影片多為「第三人稱」，但機器人需要的是「第一人稱」視角。<mark>Cosmos 3</mark> 突破了這個限制，它能理解物理世界，支援任意視角轉換，能作為未來工廠或實體機器人開發的基礎伴侶模型。
*   **<mark>Alpa Mayo 2</mark> 自駕車開源模型**：用於自動駕駛，目前採用 NVIDIA Hyperion 自駕車系統的製造商已涵蓋全球約 80% 的汽車，且連線了全球約 97% 的移動服務。
*   **NVIDIA <mark>Isaac Groot</mark> 人形機器人參考平台**：就像 <mark>PC</mark> 有公版一樣，NVIDIA 推出了為高等教育與研究人員設計的機器人參考平台。該機器人身高 6 呎（約182公分）、重 150 磅（約68公斤），搭載最新的 <mark>Thor</mark> 晶片。其雙手（由 Sharpupa 製造）各有 25 個自由度，機器人本體則有 31 個自由度，完美整合了資料生成、模擬與作業系統。
