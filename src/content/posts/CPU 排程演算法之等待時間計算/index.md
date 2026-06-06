---
title: CPU 排程演算法之等待時間計算
published: 2025-10-21
description: "這篇文章分析不同的 CPU 排程算法，包括 FCFS、SJF、SRTF、RR 和 Priority，並計算每個算法的平均等待時間。"
cover: "https://pub-a50030fee9b441a489c4fba183ba46d0.r2.dev/images/CPU%20%E6%8E%92%E7%A8%8B%E6%BC%94%E7%AE%97%E6%B3%95%E4%B9%8B%E7%AD%89%E5%BE%85%E6%99%82%E9%96%93%E8%A8%88%E7%AE%97/cpu-scheduling-algorithms.jpg"
coverInContent: false
tags:
  - CPU排程
  - 操作系統
  - 演算法
  - 性能
  - 效率
category: operating-system
draft: false
---

這次的作業主要是要根據以下四個行程（Processes），分別使用不同的 CPU 排程演算法，計算每個演算法的平均等待時間（Average Waiting Time, WT）。

| 行程 | 到達時間 A | 分割時間 Burst | 優先順序 |
| --- | --- | --- | --- |
| P1 | 0 | 8 | 3 |
| P2 | 1 | 4 | 1 |
| P3 | 2 | 9 | 4 |
| P4 | 3 | 5 | 2 |

單位：時間單位

需要計算的排程演算法如下：

1. FCFS（First Come First Serve，先來先服務）

3. SJF（Shortest Job First，非搶先）

5. SRTF（Shortest Remaining Time First，可搶先）

7. RR（Round Robin，時間片 q=4）

9. Priority（分為非搶先與可搶先兩種）

## 一、FCFS

![](https://pub-a50030fee9b441a489c4fba183ba46d0.r2.dev/images/CPU%20%E6%8E%92%E7%A8%8B%E6%BC%94%E7%AE%97%E6%B3%95%E4%B9%8B%E7%AD%89%E5%BE%85%E6%99%82%E9%96%93%E8%A8%88%E7%AE%97/image-3-1024x604.jpg)

計算等待時間：

- WT₁ = 8 - 8 = 0

- WT₂ = 12 - 5 = 7

- WT₃ = 26 - 11 = 15

- WT₄ = 17 - 8 = 9

平均等待時間：  
(0 + 7 + 15 + 9) / 4 = **8.75**

* * *

## 二、SJF

![](https://pub-a50030fee9b441a489c4fba183ba46d0.r2.dev/images/CPU%20%E6%8E%92%E7%A8%8B%E6%BC%94%E7%AE%97%E6%B3%95%E4%B9%8B%E7%AD%89%E5%BE%85%E6%99%82%E9%96%93%E8%A8%88%E7%AE%97/image-4-1024x604.jpg)

計算等待時間：

- WT₁ = 8 - 8 = 0

- WT₂ = 12 - 5 = 7

- WT₃ = 26 - 11 = 15

- WT₄ = 17 - 8 = 9

平均等待時間：  
(0 + 7 + 15 + 9) / 4 = **7.75**

* * *

## 三、SRTF

![](https://pub-a50030fee9b441a489c4fba183ba46d0.r2.dev/images/CPU%20%E6%8E%92%E7%A8%8B%E6%BC%94%E7%AE%97%E6%B3%95%E4%B9%8B%E7%AD%89%E5%BE%85%E6%99%82%E9%96%93%E8%A8%88%E7%AE%97/image-5-1024x669.jpg)

P1 : 8 -> 7 -> 0

P2 : 4 -> 0

P3 : 9 -> 0

P4 : 5 -> 0

計算等待時間：

- WT₁ = 17 - 8 = 9

- WT₂ = 5 - 5 = 0

- WT₃ = 26 - 11 = 15

- WT₄ = 10 - 8 = 2

平均等待時間：  
(9 + 0 + 15 + 2) / 4 = **6.5**

* * *

## 四、RR（時間片 q = 4）

![](https://pub-a50030fee9b441a489c4fba183ba46d0.r2.dev/images/CPU%20%E6%8E%92%E7%A8%8B%E6%BC%94%E7%AE%97%E6%B3%95%E4%B9%8B%E7%AD%89%E5%BE%85%E6%99%82%E9%96%93%E8%A8%88%E7%AE%97/image-6-1024x604.jpg)

P1 : 8 -> 4 -> 0

P2 : 4 -> 0

P3 : 9 -> 5 -> 1 -> 0

P4 : 5 -> 1 -> 0

行程執行順序：P1 → P2 → P3 → P4 → P1 → P3 → P4 → P3

計算等待時間：

- WT₁ = 20 - 8 = 12

- WT₂ = 8 - 5 = 3

- WT₃ = 26 - 11 = 15

- WT₄ = 25 - 8 = 17

平均等待時間：  
(12 + 3 + 15 + 17) / 4 = **11.75**

* * *

## 五、Priority

### (1) 非搶先 Priority

![](https://pub-a50030fee9b441a489c4fba183ba46d0.r2.dev/images/CPU%20%E6%8E%92%E7%A8%8B%E6%BC%94%E7%AE%97%E6%B3%95%E4%B9%8B%E7%AD%89%E5%BE%85%E6%99%82%E9%96%93%E8%A8%88%E7%AE%97/image-8-1024x604.jpg)

行程執行順序：P1 → P2 → P4 → P3

計算等待時間：

- WT₁ = 8 - 8 = 0

- WT₂ = 12 - 5 = 7

- WT₃ = 26 - 11 = 15

- WT₄ = 17 - 8 = 9

平均等待時間：  
(0 + 7 + 15 + 9) / 4 = **7.75**

* * *

### (2) 可搶先 Priority

![](https://pub-a50030fee9b441a489c4fba183ba46d0.r2.dev/images/CPU%20%E6%8E%92%E7%A8%8B%E6%BC%94%E7%AE%97%E6%B3%95%E4%B9%8B%E7%AD%89%E5%BE%85%E6%99%82%E9%96%93%E8%A8%88%E7%AE%97/image-9-1024x604.jpg)

P1 : 8 -> 7 -> 0

P2 : 4 -> 0

P3 : 9 -> 0

P4 : 5 -> 0

行程執行順序：P1 → P2 → P4 -> P1 → P3

計算等待時間：

- WT₁ = 17 - 8 = 9

- WT₂ = 5 - 5 = 0

- WT₃ = 26 - 11 = 15

- WT₄ = 10 - 8 = 2

平均等待時間：  
(9 + 0 + 15 + 2) / 4 = **6.5**

* * *

## 結論

| 排程演算法 | 平均等待時間 (WT) |
| --- | --- |
| FCFS | 8.75 |
| SJF（非搶先） | 7.75 |
| SRTF（可搶先） | 6.5 |
| RR（q=4） | 11.75 |
| Priority（非搶先） | 7.75 |
| Priority（可搶先） | 6.5 |

由結果可看出，**可搶先型的 SRTF 與 Priority 演算法**在此案例中具有最短的平均等待時間（6.5），效率最佳。

