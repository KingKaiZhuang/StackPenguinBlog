---
title: "AI / Machine Learning 測驗觀念筆記：從監督式學習到 Responsible AI"
published: 2026-07-19
description: "整理 AI 與機器學習測驗中的核心觀念，包含 supervised learning、reinforcement learning、LLM、模型訓練與 Responsible AI governance。"
cover: "https://img.stackpenguin.com/images/2026-07-19-ai-machine-learning-quiz-notes/ai-machine-learning-notes.jpg"
coverInContent: false
tags:
  - AI
  - Machine Learning
  - LLM
  - Responsible AI
  - 筆記
category: ai
draft: false
---

這篇是整理 AI 與 Machine Learning 測驗後做成的中英雙語觀念筆記。重點不是只背答案，而是把常見概念放回實際情境中理解，尤其是什麼時候該用 supervised learning、unsupervised learning、self-supervised learning、reinforcement learning，以及如何分辨 classification、regression、generative AI 和 discriminative AI。

## 1. AI、Machine Learning 與 Generative AI 的基本關係

### Artificial Intelligence / 人工智慧

**AI (Artificial Intelligence)** 是讓機器表現出類似人類智慧行為的技術總稱，例如：

- 理解語言 / understanding language
- 做決策 / making decisions
- 解決問題 / solving problems
- 辨識圖片 / recognizing images
- 生成文字、圖片、音樂 / generating text, images, music

AI 是最大的概念，Machine Learning、Deep Learning、Generative AI 都可以視為 AI 的子領域。

```plaintext
AI
└── Machine Learning
    └── Deep Learning
        └── Generative AI / LLMs
```

---

### Machine Learning / 機器學習

**Machine Learning (ML)** 是一種讓電腦從資料中找出模式，而不是完全由人類手寫規則的方法。

英文重點：

> Machine learning uses statistical techniques to help computers find patterns in data and make predictions or decisions.

中文理解：

> 機器學習本質上是借用統計方法，讓模型從資料中學習規律，進而預測、分類或做決策。

範例：

- 用植物照片和品種標籤訓練模型辨識植物
- 用客戶資料預測誰可能取消訂閱
- 用天氣資料預測明天是否下雨

---

### Generative AI / 生成式人工智慧

**Generative AI** 是會「產生新內容」的 AI。

它可以生成：

- 文字 / text
- 圖片 / images
- 音樂 / music
- 影片 / video
- 程式碼 / code
- 摘要 / summaries

英文重點：

> Generative AI creates new content based on patterns learned from training data.

中文理解：

> 生成式 AI 不是只判斷或分類，而是根據訓練資料中的模式產生新的內容。

常見例子：

- ChatGPT 產生文章或回答
- 圖像生成工具產生圖片
- AI 幫你想標題、摘要、草稿

---

## 2. 什麼時候使用哪一種 AI / ML 訓練方式？

這是整份筆記最重要的一段。

選擇學習方式時，可以先問自己三個問題：

1. **我有沒有正確答案或標籤？ / Do I have labels?**
2. **我要預測、分類、分群，還是讓系統學會行動策略？ / Am I predicting, classifying, clustering, or learning actions?**
3. **輸出是判斷結果，還是要生成新內容？ / Is the output a decision or new content?**

---

## 3. Supervised Learning / 監督式學習

### 定義

**Supervised learning** 使用「已標記資料 / labeled data」來訓練模型。

英文：

> Supervised learning trains a model using examples that include both input data and the correct answer.

中文：

> 監督式學習會給模型資料和正確答案，讓模型學會從輸入推測輸出。

---

### 什麼時候使用？

當你有「輸入」和「正確答案」時，通常使用 supervised learning。

適合情境：

- 有圖片，也知道圖片中的植物品種
- 有房屋資料，也知道成交價格
- 有 Email，也知道是不是垃圾郵件
- 有評論文字，也知道情緒分類
- 有歷史客戶資料，也知道誰最後取消訂閱

---

### 常見任務

Supervised learning 通常分成兩大類：

1. **Classification / 分類**
2. **Regression / 迴歸**

---

## 4. Classification / 分類

**Classification** 是預測「類別」。

英文：

> Classification predicts which category or class an input belongs to.

中文：

> 分類任務的答案是離散類別，不是連續數字。

---

### Binary Classification / 二元分類

**Binary classification** 是只有兩個類別的分類。

適合情境：

- 是垃圾郵件 / 不是垃圾郵件
- 會流失客戶 / 不會流失客戶
- 有病 / 沒有病
- 通過 / 不通過
- 詐騙交易 / 正常交易

英文重點：

> Binary classification is used when the model must choose between two possible classes.

中文重點：

> 只要答案只有兩種，就通常是二元分類。

範例：

```plaintext
Input: Email text
Output: Spam or Not Spam
```

---

### Multiclass Classification / 多類別分類

**Multiclass classification** 是有三個以上類別的分類。

適合情境：

- 植物品種分類
- 手寫數字 0 到 9
- 情緒分類：positive / neutral / negative
- 問卷答案：strongly agree / neutral / strongly disagree
- 動物圖片分類：cat / dog / bird / fish

英文重點：

> Multiclass classification is used when the output can belong to one of three or more categories.

中文重點：

> 如果答案是三個以上的類別，就屬於多類別分類。

測驗中的例子：

```plaintext
strongly agree / neutral / strongly disagree
```

這是 supervised learning + multiclass classification，因為：

- 有標記資料
- 要預測的是三個類別之一

---

## 5. Regression / 迴歸

**Regression** 是預測連續數值。

英文：

> Regression predicts a continuous numerical value.

中文：

> 迴歸任務的答案是數字，而且通常是連續值。

適合情境：

- 預測房價
- 預測明天溫度
- 預測銷售額
- 預測股票價格
- 預測顧客一年的消費金額

範例：

```plaintext
Input: house size, location, number of rooms
Output: price = 12,000,000
```

不要把 regression 和 classification 搞混：

| 問題 | 任務 |
|---|---|
| 明天會不會下雨？ | Binary classification |
| 明天氣溫幾度？ | Regression |
| 這張圖片是哪一種植物？ | Multiclass classification |
| 這間房子值多少錢？ | Regression |

---

## 6. Unsupervised Learning / 非監督式學習

### 定義

**Unsupervised learning** 使用「沒有標籤 / unlabeled data」的資料，讓模型自己找出模式或群組。

英文：

> Unsupervised learning finds patterns, structures, or groups in data without labeled answers.

中文：

> 非監督式學習沒有標準答案，模型要自己從資料中找出結構。

---

### 什麼時候使用？

當你沒有正確答案，但想探索資料結構時，使用 unsupervised learning。

適合情境：

- 將客戶自動分群
- 發現購物行為模式
- 找出異常交易
- 將文章依主題分群
- 找出資料中的隱藏結構

範例：

```plaintext
Input: Customer purchase histories
Output: Group A, Group B, Group C
```

模型不會知道哪一群叫「高價值客戶」，但它可以先把相似行為的人分在一起。

---

### 常見任務

- **Clustering / 分群**
- **Dimensionality reduction / 降維**
- **Anomaly detection / 異常偵測**

---

## 7. Self-Supervised Learning / 自監督式學習

### 定義

**Self-supervised learning** 是介於 supervised 和 unsupervised 之間的重要方法。它不需要人工標籤，而是從資料本身創造訓練目標。

英文：

> Self-supervised learning creates labels or prediction tasks from the data itself.

中文：

> 自監督式學習不靠人工標籤，而是把資料的一部分拿掉，讓模型學會預測被遮住或缺失的部分。

---

### 什麼時候使用？

當你有大量未標記資料，但人工標註成本太高時，可以使用 self-supervised learning。

適合情境：

- 訓練大型語言模型
- 訓練文字模型預測下一個字
- 訓練影像模型補齊圖片缺失部分
- 從大量網頁、書籍、文章中學習語言模式

LLM 就大量使用類似自監督的方式學習語言模式。

範例：

```plaintext
Sentence: The cat sat on the ___.
Model learns to predict: mat
```

或：

```plaintext
Prompt: I want to learn machine
Next token prediction: learning
```

---

## 8. Reinforcement Learning / 強化學習

### 定義

**Reinforcement learning (RL)** 是讓 agent 透過「行動、獎勵、懲罰」學會策略的方法。

英文：

> Reinforcement learning trains an agent to make decisions by receiving rewards or penalties from its environment.

中文：

> 強化學習不是直接給正確答案，而是讓系統嘗試行動，根據 reward 逐漸學會更好的策略。

---

### 核心元素

| English | 中文 | 說明 |
|---|---|---|
| Agent | 智能體 | 做決策的系統 |
| Environment | 環境 | agent 所處的世界 |
| Action | 行動 | agent 可以做的事 |
| Reward | 獎勵 | 行動後得到的分數或回饋 |
| Policy | 策略 | agent 決定下一步怎麼做的規則 |

---

### 什麼時候使用？

當問題重點是「學會一連串行動」而不是單次分類或預測時，適合 reinforcement learning。

適合情境：

- 遊戲 NPC 學會更好的策略
- 機器人學走路或抓取物品
- 自動駕駛在模擬環境中學決策
- 推薦系統根據使用者互動調整策略
- 系統需要根據 reward 改善長期結果

測驗例子：

```plaintext
NPC gets points or rewards for good behavior.
```

這是 reinforcement learning。

---

### Reinforcement Learning vs Supervised Learning

| 問題 | Supervised Learning | Reinforcement Learning |
|---|---|---|
| 有沒有標準答案？ | 有 | 通常沒有直接標準答案 |
| 學習來源 | labeled examples | rewards / penalties |
| 目標 | 預測正確答案 | 找到最佳行動策略 |
| 例子 | 圖片分類 | 遊戲 AI、機器人控制 |

---

## 9. Q-Learning

**Q-learning** 是 reinforcement learning 的一種演算法。

英文：

> Q-learning is a reinforcement learning technique that helps an agent learn which actions produce the best long-term rewards.

中文：

> Q-learning 會幫 agent 學習「在某個狀態下，做哪個動作最可能帶來最高長期獎勵」。

---

### Q-value 是什麼？

Q-value 可以理解成：

```plaintext
在某個 state 做某個 action 的預期價值
```

英文：

> A Q-value estimates how valuable an action is in a given state.

範例：

```plaintext
State: NPC is near an enemy.
Action A: attack
Action B: run away
Q-learning learns which action leads to better rewards over time.
```

---

## 10. Generative AI vs Discriminative AI

### Discriminative AI / 判別式 AI

**Discriminative AI** 用來判斷、分類、預測。

英文：

> Discriminative AI learns the boundary between categories and predicts labels or outcomes.

中文：

> 判別式 AI 的重點是「判斷這是什麼」或「預測結果」。

適合情境：

- 判斷 Email 是否為垃圾郵件
- 預測客戶是否會流失
- 分類圖片中的物種
- 判斷交易是否異常

測驗例子：

```plaintext
A system analyzes customer data to predict customer behavior.
```

這是 discriminative AI，不是 generative AI。

---

### Generative AI / 生成式 AI

**Generative AI** 用來創造新內容。

英文：

> Generative AI produces new content such as text, images, audio, or code.

中文：

> 生成式 AI 的重點是「產生東西」，不是只做分類判斷。

適合情境：

- 產生文章標題
- 寫 Email 草稿
- 生成圖片
- 摘要長篇文章
- 協助產生程式碼

---

### 快速判斷

| 需求 | AI 類型 |
|---|---|
| 預測客戶是否會購買 | Discriminative AI |
| 判斷圖片是貓還是狗 | Discriminative AI |
| 產生一張貓的圖片 | Generative AI |
| 幫文章想 10 個標題 | Generative AI |
| 分析交易是否詐騙 | Discriminative AI |
| 寫一段產品介紹文 | Generative AI |

---

## 11. 模型訓練流程：Training / Test Split

### Training Set / 訓練集

**Training set** 是用來讓模型學習的資料。

英文：

> The training set is the data used to teach the model.

中文：

> 訓練集是模型用來學習模式的資料。

---

### Test Set / 測試集

**Test set** 是保留下來，訓練時不給模型看，用來檢查模型是否真的學會的資料。

英文：

> The test set is held back and used to evaluate how well the model performs on unseen data.

中文：

> 測試集用來檢查模型面對新資料時表現如何。

---

### 為什麼要切分？

如果模型只在訓練資料上表現好，不代表它真的會泛化到新資料。

英文：

> A model should perform well not only on training data, but also on new, unseen data.

中文：

> 好模型不是背答案，而是要能處理沒看過的新資料。

---

### 測驗例子

如果你要建立一個天氣預測模型，正確流程是：

```plaintext
Find labeled weather data,
create a training set,
and set aside more data for the test set.
```

也就是：

1. 找有標籤的天氣資料
2. 用一部分資料訓練
3. 保留另一部分資料測試

---

## 12. Weights / 權重

**Weights** 是神經網路中可調整的參數，用來控制輸入特徵對輸出的影響程度。

英文：

> Weights allow a neural network to tune itself during training.

中文：

> 權重讓神經網路可以在訓練過程中調整自己，學會哪些輸入比較重要。

範例：

```plaintext
House price prediction:
- size may have a large weight
- color of front door may have a small weight
```

如果某個特徵對答案影響很大，它的 weight 通常會變得比較重要。

---

## 13. Bias / 偏置

**Bias** 是模型中的另一種可學習參數，用來調整整體輸出。

英文：

> Bias helps shift the model's output so it can fit the data better.

中文：

> Bias 像是模型的基準調整值，可以讓模型輸出更貼近資料。

簡化理解：

```plaintext
output = weight * input + bias
```

如果模型已經接近正確答案，訓練可能只需要微調 bias 或 weights。

---

## 14. Cost Function / Loss Function / 成本函數

**Cost function** 或 **loss function** 用來衡量模型預測錯得多嚴重。

英文：

> A cost function helps the network quantify how wrong it was when making a prediction.

中文：

> 成本函數會把「預測錯誤程度」轉成數字，讓模型知道該怎麼調整。

範例：

```plaintext
Predicted price: 900,000
Actual price:    1,000,000
Error:           100,000
```

模型訓練的目標通常是：

```plaintext
Minimize the cost / loss
降低錯誤
```

---

## 15. Overfitting / 過度擬合

### 定義

**Overfitting** 是模型太貼合訓練資料，導致面對新資料時表現不好。

英文：

> Overfitting happens when a model learns the training data too closely and fails to generalize to new data.

中文：

> 過度擬合就像模型把考古題背起來，但遇到新題目就不會了。

---

### 常見原因

- 模型太複雜
- 參數太多
- 訓練資料太少
- 訓練太久
- 訓練資料有雜訊但模型也一起背下來

---

### 測驗例子

如果一個模型有非常多參數，例如 1100 個參數，但：

- 很耗資源
- 預測效果不好
- 對新資料表現差

這通常是 overfitting。

---

### 如何改善？

可能方法：

- 使用更多訓練資料
- 降低模型複雜度
- 使用 regularization
- 使用 validation set 調整模型
- 早停 / early stopping

---

## 16. Black Box Problem / 黑箱問題

**Black box** 指的是模型可以給答案，但人類難以理解它為什麼做出這個決策。

英文：

> A black box system makes decisions in ways humans cannot easily understand or explain.

中文：

> 黑箱問題是指 AI 的決策過程不透明，人類很難知道它為什麼這樣判斷。

---

### 為什麼重要？

在高風險領域，黑箱問題特別嚴重，例如：

- 醫療診斷
- 貸款審核
- 招募錄取
- 司法風險評估
- 保險價格

如果模型拒絕某人的貸款，但無法解釋原因，就會產生公平性、責任與信任問題。

---

## 17. LLM / Large Language Model / 大型語言模型

### 定義

**LLM (Large Language Model)** 是訓練在大量文字資料上的模型，能理解與生成自然語言。

英文：

> Large language models use probability to predict the next words or tokens in response to a prompt.

中文：

> LLM 的核心是根據 prompt 和上下文，用機率預測下一個 token。

---

### Token 是什麼？

Token 可以是：

- 一個字
- 一個詞的一部分
- 一個標點符號
- 一段常見字串

簡化理解：

```plaintext
Prompt: Artificial intelligence is
Model predicts likely next tokens:
- useful
- changing
- a
- transforming
```

---

### LLM 不等於真正理解

LLM 能產生像人類的文字，但不代表它真的有意識、經驗或情感。

測驗中的「愛」的問題重點：

> AI does not truly experience love. It compiles and generates responses based on patterns in human-created content.

中文：

> AI 不是真的體驗愛，而是根據人類創造的內容整理出看起來合理的回答。

---

## 18. Chinese Room / 中文房間論證

**Chinese Room Argument** 用來說明：

> A system can appear intelligent while only manipulating symbols without real understanding.

中文：

> 一個系統看起來像懂中文，但可能只是根據規則操作符號，並不是真的理解中文。

測驗重點：

```plaintext
Sometimes systems can seem intelligent,
but they are just mindlessly matching patterns.
```

這也提醒我們：

- AI 的輸出可能很像理解
- 但它可能只是模式匹配
- 不應把流暢回答直接等同於真正理解

---

## 19. Reasoning Engine / 推理引擎

### 定義

**Reasoning engine** 是能根據資料進行推理、整理、決策、摘要或解決問題的系統。

英文：

> A reasoning engine draws conclusions, makes decisions, summarizes information, and solves problems based on available data.

中文：

> 推理引擎會根據可用資料進行判斷、摘要、解題與推論。

---

### 它可以做什麼？

- 理解問題
- 分析資料
- 比較不同觀點
- 摘要文章
- 推導可能答案
- 協助腦力激盪

例如：

```plaintext
Use ChatGPT to request article titles on a topic.
```

這是 reasoning engine 很適合做的任務。

---

## 20. Search Engine Crawling / 搜尋引擎爬取

### Crawling 是什麼？

**Crawling** 是搜尋引擎不斷瀏覽網頁、發現新頁面、更新索引的過程。

英文：

> Crawling is a continuous process that helps a search engine keep its index up to date.

中文：

> 爬取是搜尋引擎持續掃描網頁、蒐集資訊、更新索引的過程。

---

### Crawling vs Searching

| Concept | 中文 | 說明 |
|---|---|---|
| Crawling | 爬取 | 搜尋引擎機器人探索網頁 |
| Indexing | 建立索引 | 把網頁內容整理進資料庫 |
| Searching | 搜尋 | 使用者輸入查詢後，系統從索引中找結果 |

---

## 21. Natural Language Processing / NLP / 自然語言處理

**NLP** 讓電腦能處理人類語言。

英文：

> Natural language processing helps systems interpret, process, and respond to human language.

中文：

> NLP 讓系統可以理解文字或語音描述，並轉換成可操作的資訊。

測驗例子：

```plaintext
You describe what you want,
and the system converts your natural language description into a search.
```

這就是 NLP 的應用。

---

## 22. Hallucination / AI 幻覺

### 定義

**Hallucination** 是 AI 自信地產生錯誤內容。

英文：

> A hallucination occurs when an AI system presents a confident response that is actually false.

中文：

> AI 幻覺是指 AI 看起來很有把握，但內容其實是錯的。

---

### 為什麼危險？

因為 AI 的語氣可能很肯定，使用者容易相信。

常見形式：

- 編造不存在的引用
- 說錯法律、政策或日期
- 產生錯誤的技術步驟
- 把不確定資訊講得像事實

---

### 如何降低風險？

- 要求提供來源
- 查核重要資訊
- 對醫療、法律、財務資訊特別小心
- 不要只因為語氣自信就相信

---

## 23. Bias / 偏見

### 定義

**Bias** 是 AI 系統在資料、設計或輸出中呈現不公平或片面的傾向。

英文：

> Bias occurs when an AI system produces unfair, incomplete, or one-sided results because of its data, design, or assumptions.

中文：

> 偏見可能來自訓練資料、設計假設、社會文化背景或使用者提示。

---

### 測驗例子

如果 AI 回答政治制度問題時，只提到：

```plaintext
federal and state governments
```

它可能呈現美國或西方中心觀點，而忽略其他國家的制度。

這就是：

```plaintext
The system is displaying bias toward a Western perspective.
```

---

### 常見偏見來源

- 訓練資料不平衡
- 特定文化或語言資料過多
- 歷史資料本身有歧視
- 測試資料不足
- 開發團隊缺乏多元觀點

---

## 24. Copyright / 著作權

### 生成式 AI 與著作權

測驗中的觀念包括：

- AI 生成圖片是否能受著作權保護，是一個重要法律問題
- AI 服務可能使用公開資料或使用者上傳資料進行訓練
- 是否能使用某些藝術作品，必須看 licensing agreement

英文重點：

> A key ethical and legal question is whether the system can use the art within the current licensing agreement.

中文重點：

> 使用 AI 生成或訓練內容時，要確認素材是否在授權範圍內。

---

### 實務提醒

這類規則會因國家、年份、法院判例、平台條款而不同。測驗答案反映的是課程脈絡，不應直接當成法律意見。

實務上應檢查：

- 使用者條款 / Terms of Service
- 授權條款 / Licensing agreement
- 作品來源 / Source of content
- 是否允許商業使用 / Commercial use
- 是否允許訓練 AI / AI training permission
- 當地最新法律與政策 / Current law and policy

---

## 25. Transparency / 透明度

### 定義

**Transparency** 是讓使用者、客戶或利害關係人理解 AI 系統如何使用資料、如何做決策，以及有什麼限制。

英文：

> Transparency means giving users meaningful insight into how AI systems work, make decisions, and use data.

中文：

> 透明度是讓人知道 AI 系統如何運作、如何使用資料、如何產生決策。

---

### 測驗重點

如果公司說客戶應該了解 AI 系統如何運作，這代表需要：

```plaintext
greater transparency into how these systems are making decisions
```

也就是：

```plaintext
讓使用者更清楚 AI 如何做出決策
```

---

### 缺乏透明度的風險

- 使用者不知道資料被如何使用
- 使用者不知道資料是否會被出售
- 客戶無法理解 AI 決策原因
- 難以追究責任
- 降低信任

測驗例子：

```plaintext
They were not transparent about how they use or potentially sell your data.
```

---

## 26. Privacy Policy / 隱私政策

### 清楚的隱私政策很重要

如果一家公司使用 AI 系統，但沒有清楚說明資料如何被收集、使用、分享或出售，這是重大問題。

英文：

> A company should share a clear and transparent privacy policy.

中文：

> 公司應該提供清楚透明的隱私政策，讓使用者知道資料如何被處理。

---

### 應該說明的內容

- 收集哪些資料
- 為什麼收集
- 資料會保存多久
- 是否分享給第三方
- 是否用於 AI 訓練
- 使用者能否刪除或退出

---

## 27. Responsible AI Governance / 負責任 AI 治理

### 定義

**Responsible AI governance** 是組織為了安全、公平、透明、可問責地使用 AI 所建立的政策、流程與責任架構。

英文：

> Responsible AI governance provides policies, procedures, and accountability structures for ethical AI development and use.

中文：

> 負責任 AI 治理是建立制度，確保 AI 的開發與使用符合倫理、安全、公平與透明原則。

---

### 測驗重點

如果公司要導入 AI，重要步驟包括：

```plaintext
Create a Responsible AI Policy and Governance framework.
```

以及：

```plaintext
Ensure that policies and procedures exist for ethical concerns.
```

---

### Responsible AI Governance 應包含

- Ethical principles / 倫理原則
- Data privacy rules / 資料隱私規範
- Human oversight / 人類監督
- Bias testing / 偏見測試
- Transparency requirements / 透明度要求
- Security controls / 安全控管
- Risk assessment / 風險評估
- Accountability / 問責機制
- Safe-use boundaries / 安全使用邊界

---

## 28. Human Oversight / 人類監督

AI 系統不應在所有情境中完全沒有監督地做重要決策。

英文：

> Human oversight helps ensure that AI systems are used safely, ethically, and appropriately.

中文：

> 人類監督可以降低 AI 錯誤、偏見、濫用或不當決策的風險。

測驗中不適當的說法是：

```plaintext
Generative AI systems will start to run organizations with little to no human oversight.
```

這不是負責任 AI 的理想方向。

---

## 29. Safe Boundaries for Chatbots / 聊天機器人的安全邊界

當組織使用 chatbot 時，需要設定安全且合適的使用邊界。

英文：

> Organizations should make sure chatbots have boundaries for safe and appropriate use.

中文：

> 聊天機器人需要明確限制，避免回答危險、不適當或超出能力範圍的內容。

可能包含：

- 不提供醫療診斷
- 不提供法律結論
- 不洩漏個資
- 不協助危險行為
- 遇到高風險問題時轉交真人

---

## 30. Strong AI / 強人工智慧

**Strong AI** 指的是機器具備像完整人類一樣的廣泛智慧與行為能力。

英文：

> Strong AI refers to a machine displaying the behavior expected from a full-fledged person.

中文：

> 強 AI 不是只會完成單一任務，而是像完整的人一樣具備廣泛智能。

目前常見 AI 多數仍屬於 narrow AI，也就是只擅長特定任務。

---

## 31. Generative AI 與日常創作工具的類比

測驗中將 generative AI 與 photography 類比：

英文：

> Like photography, generative AI puts technology in the hands of everyday users.

中文：

> 就像攝影降低了影像創作門檻，生成式 AI 也把創作工具交到一般使用者手中。

重點不是 AI 一定取代人類，而是：

- 降低創作門檻
- 讓非專業人士也能產生內容
- 改變創作流程
- 讓更多人能參與表達

---

## 32. 哪些工作較不容易被 Generative AI 取代？

測驗重點：

```plaintext
heavy, physical labor
```

也就是重體力、實體環境中的工作短期較不容易被純生成式 AI 取代。

原因：

- 需要身體操作
- 需要現場判斷
- 需要物理互動
- 不只是文字或數位內容生成

---

## 33. AI 系統品質取決於什麼？

生成式 AI 系統的品質很大程度取決於：

```plaintext
the quality of the algorithm and the data sets used to train the model
```

中文：

> AI 品質取決於演算法品質與訓練資料品質。

資料品質問題會造成：

- 偏見
- 錯誤輸出
- 覆蓋範圍不足
- 表現不穩定
- 不公平結果

---

## 34. Debate-Style Prompts / 辯論式提示

要求 AI 從不同角度回答，可以幫助你理解多方觀點。

英文：

> Debate-style questions can give you a better understanding of different perspectives.

中文：

> 辯論式問題可以讓你看到正反觀點，避免只得到單一角度答案。

範例 prompt：

```plaintext
Give me arguments for and against using AI in education.
```

中文：

```plaintext
請分別列出支持與反對 AI 用於教育的理由。
```

---

## 35. 快速選擇表：我該用哪種方法？

| 你的問題 | 建議方法 | English |
|---|---|---|
| 我有標記資料，要預測類別 | Supervised learning + classification | Labeled data, predict class |
| 我有標記資料，要預測數字 | Supervised learning + regression | Labeled data, predict number |
| 答案只有兩類 | Binary classification | Two classes |
| 答案有三類以上 | Multiclass classification | Three or more classes |
| 沒有標籤，想找群組 | Unsupervised learning | No labels, find groups |
| 大量未標記資料，想讓模型自己產生學習任務 | Self-supervised learning | Create labels from data itself |
| 系統要透過獎勵學行動策略 | Reinforcement learning | Learn actions through rewards |
| 系統要學長期最佳行動 | Q-learning or other RL methods | Learn long-term reward strategy |
| 我要生成文章、圖片、程式碼 | Generative AI | Create new content |
| 我要分類、判斷、預測 | Discriminative AI | Predict or classify |
| 我要理解與處理人類語言 | NLP / LLM | Process natural language |
| 我要摘要、推理、比較觀點 | Reasoning engine | Analyze and reason |

---

## 36. 常見混淆整理

### Classification vs Regression

| Classification | Regression |
|---|---|
| 預測類別 | 預測數字 |
| spam / not spam | temperature = 28.5 |
| plant species | house price |
| pass / fail | revenue |

---

### Supervised vs Unsupervised

| Supervised Learning | Unsupervised Learning |
|---|---|
| 有標籤 | 沒有標籤 |
| 有正確答案 | 沒有標準答案 |
| 用來預測或分類 | 用來分群或找模式 |
| 例：垃圾郵件分類 | 例：客戶分群 |

---

### Generative vs Discriminative

| Generative AI | Discriminative AI |
|---|---|
| 生成新內容 | 判斷或分類 |
| 寫文章、畫圖、寫程式 | 預測、分類、偵測 |
| output is new content | output is a label or prediction |

---

### LLM vs Search Engine

| LLM | Search Engine |
|---|---|
| 根據機率生成回答 | 從索引中找網頁 |
| 可能 hallucinate | 結果來自已索引頁面 |
| 可摘要、改寫、推理 | 可找來源與網頁 |
| 不等於資料庫 | 依 crawling / indexing 運作 |

---

## 37. 40 題觀念對照表

| 題號 | 核心觀念 | 中英重點 |
|---|---|---|
| 1 | Supervised learning | 有標記植物圖片，用監督式學習 |
| 2 | AI does not truly experience love | AI 生成回答不代表真正體驗情感 |
| 3 | Chinese Room | 看似智能不代表真正理解 |
| 4 | Human-created content | AI 從大量人類創作內容中學習 |
| 5 | Strong AI | 像完整人類一樣展現廣泛智能 |
| 6 | Overfitting | 模型太複雜、參數過多、泛化差 |
| 7 | Statistics in ML | ML 借用統計技術找資料模式 |
| 8 | Supervised multiclass classification | 有標籤且三類以上分類 |
| 9 | Reinforcement learning | agent 透過 reward 學策略 |
| 10 | NLP | 將自然語言描述轉成搜尋 |
| 11 | Black box | 人類難以理解模型決策原因 |
| 12 | Q-learning | 強化學習中改善行動策略的方法 |
| 13 | Cost function | 衡量模型預測錯誤程度 |
| 14 | Training/test split | 用訓練集學習，測試集評估 |
| 15 | Weights | 權重讓神經網路調整自己 |
| 16 | Bias | bias 可微調模型輸出 |
| 17 | Discriminative AI | 分析與預測客戶行為屬判別式 AI |
| 18 | Reasoning engine | 理解、推理、對話與解題 |
| 19 | LLM probability | LLM 用機率預測下一個 token |
| 20 | Hallucination | 自信但錯誤的 AI 回答 |
| 21 | Algorithm and data quality | AI 品質取決於演算法與資料 |
| 22 | Search engine crawling | 持續爬取以更新搜尋索引 |
| 23 | Bias | 回答呈現西方或美國中心偏見 |
| 24 | Physical labor | 重體力工作較不易被生成式 AI 取代 |
| 25 | Use existing GenAI service | 技術能力不足時可使用成熟 AI 服務 |
| 26 | Reasoning engine | 根據資料下結論、決策、摘要、解題 |
| 27 | ChatGPT for ideation | 使用 reasoning engine 產生文章標題 |
| 28 | Debate-style questions | 辯論式提示幫助理解不同觀點 |
| 29 | Generative AI democratizes creation | 像攝影一樣降低創作門檻 |
| 30 | Privacy policy | 公司需清楚透明說明資料使用 |
| 31 | Copyright of AI-generated images | AI 生成作品著作權需注意最新規範 |
| 32 | Fair use / training data | AI 服務訓練資料使用涉及條款與法律 |
| 33 | Ethical value statement | 高層倫理價值聲明是治理責任之一 |
| 34 | Responsible AI governance | 建立 Responsible AI policy and governance framework |
| 35 | Chatbot boundaries | 聊天機器人需安全與適當使用邊界 |
| 36 | Human oversight | 不應讓 AI 在無監督下管理組織 |
| 37 | Data transparency | 需透明說明資料如何使用或出售 |
| 38 | Transparency | 客戶應理解 AI 如何做決策 |
| 39 | Licensing agreement | 使用藝術作品需確認授權範圍 |
| 40 | Ethical procedures | 先確保有處理倫理問題的政策與程序 |

---

## 38. 考前快速複習

### 如果看到 labeled data

想到：

```plaintext
Supervised learning
```

如果答案是類別：

```plaintext
Classification
```

如果答案是數字：

```plaintext
Regression
```

---

### 如果看到 reward

想到：

```plaintext
Reinforcement learning
```

如果提到 agent 學習哪個 action 最好：

```plaintext
Q-learning
```

---

### 如果看到 no labels

想到：

```plaintext
Unsupervised learning
```

如果是大量未標記資料但模型自己創造預測任務：

```plaintext
Self-supervised learning
```

---

### 如果看到 create / generate

想到：

```plaintext
Generative AI
```

---

### 如果看到 predict / classify / detect

想到：

```plaintext
Discriminative AI
```

---

### 如果看到 confident but false

想到：

```plaintext
Hallucination
```

---

### 如果看到 cannot explain decision

想到：

```plaintext
Black box
```

---

### 如果看到 ethical policy / procedures

想到：

```plaintext
Responsible AI governance
```

---

## 39. 一句話總結

```plaintext
Supervised learning learns from labeled answers.
Unsupervised learning finds hidden patterns without labels.
Self-supervised learning creates learning tasks from raw data.
Reinforcement learning learns actions through rewards.
Generative AI creates new content.
Discriminative AI predicts, classifies, or detects.
Responsible AI makes AI safer, fairer, more transparent, and accountable.
```

中文：

```plaintext
監督式學習看標籤學答案。
非監督式學習在沒標籤的資料中找模式。
自監督式學習從資料本身設計訓練任務。
強化學習靠獎勵學行動策略。
生成式 AI 產生新內容。
判別式 AI 負責預測、分類、偵測。
負責任 AI 治理讓 AI 更安全、公平、透明且可問責。
```

