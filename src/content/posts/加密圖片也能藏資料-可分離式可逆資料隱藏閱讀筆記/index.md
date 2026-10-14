---
title: 加密圖片也能藏資料：讀懂 Separable Reversible Data Hiding
published: 2026-10-14
description: "以論文閱讀筆記的方式，整理可分離式加密影像可逆資料隱藏的三把鑰匙情境、LSB 壓縮、資料擷取與無失真復原。"
cover: "./cover-card-v2.png"
coverInContent: false
tags:
  - image-encryption
  - data-hiding
  - information-security
  - paper-reading
category: 技術
sourceLink: "https://doi.org/10.1109/TIFS.2011.2176120"
draft: false
---

> [!IMPORTANT]
> **引用聲明**：本文是 Xinpeng Zhang〈*Separable Reversible Data Hiding in Encrypted Image*〉的繁體中文閱讀筆記與教學整理，不是本文作者提出的新研究成果。文中的方法、實驗數據與結論均應追溯並引用原始論文；本文只做說明與簡化示例。

加密通常讓圖片看起來像雜訊，也讓沒有加密金鑰的人無法理解內容。不過，如果服務提供者想在**不知道原圖內容**的前提下，在加密圖片裡附加一小段資料，例如來源資訊、註記或驗證資料，還有可能在之後把原圖完全還原嗎？

Zhang 在 2012 年提出的這個方法，回答的是「可以，但接收者持有哪一把 key，會得到不同能力」。它的關鍵不是單純把資料塞進 LSB，而是把「資料擷取」和「影像復原」拆開處理。

## 這篇論文想解決什麼問題？

傳統情況下，若要從加密圖片取出隱藏資料，通常必須先解密；但這會讓擷取資料的人先看到原始影像內容。這篇論文要達成的目標是：

1. 影像擁有者用 **encryption key** 加密原圖。
2. 資料嵌入者只用 **data-hiding key**，就在加密圖片中嵌入額外資料。
3. 接收者可以依持有的 key，分別取得資料、近似影像，或完整原圖。

可把整個流程想成：

```text
Original image
  └─ Encryption key → Encrypted image
       └─ Data-hiding key → Encrypted image with embedded data
```

## 三種持有 key 的結果

這也是「separable（可分離）」最重要的意思。

| 接收者持有的 key | 可以得到什麼？ | 看得到原圖內容嗎？ |
| --- | --- | --- |
| 只有 data-hiding key | 擷取 additional payload | 不可以 |
| 只有 encryption key | 一張接近原圖的直接解密影像 | 可以看見大致內容，但部分低位元可能不同 |
| 同時有兩把 key | 擷取 payload，並無誤還原原圖 | 可以，而且可完整復原 |

其中的 **additional payload** 是額外嵌入的 bit 串流。它可以代表來源資訊、影像註記或驗證資料；論文的方法本身不限制它一定是文字。

## 第一步：逐 bit 加密影像

一個 8-bit 灰階像素可表示為 0 到 255。論文將每個原始 bit 與由 encryption key 產生的偽隨機 bit 做 XOR：

$$
B_{i,j,u}=b_{i,j,u}\oplus r_{i,j,u}
$$

其中：

- $b_{i,j,u}$：原始像素的第 $u$ 個 bit。
- $r_{i,j,u}$：由 encryption key 產生的偽隨機 bit。
- $B_{i,j,u}$：加密後的 bit。
- $\oplus$：XOR 運算。

因為 XOR 再做一次同樣的偽隨機 bit 就能還原，所以有 encryption key 的人可以對所有像素解密。不過資料嵌入會改動一部分 LSB，因此直接解密得到的是近似影像 $p'$，不一定立刻就是原始像素 $p$。

## 第二步：如何在加密圖片中騰出空位？

資料嵌入者先用 data-hiding key 隨機選出 $N_P$ 個 encrypted pixels，將它們的 LSB 改寫成三個參數：

- $M$：每個像素取用多少個 LSB。
- $L$：一組包含多少個像素。
- $S$：每組能嵌入多少個 bit。

這些 parameter pixels 的原 encrypted LSB 不能直接丟掉，所以會先備份到後面的嵌入串流中。

接著，剩下的像素依 data-hiding key 排列並分組。每組有 $L$ 個像素、每個像素取 $M$ 個 LSB，因此一組原本有 $ML$ 個 encrypted LSB。論文利用二元矩陣 $G$ 將它壓縮成 $ML-S$ 個 bit：

$$
C_k=G B_k\pmod{2}
$$

這裡的 $\pmod{2}$ 就是二進位的 XOR 規則，例如 $1+1=0\pmod 2$。壓縮後少了 $S$ 個 bit，於是每組就多出 $S$ 個位置可以寫入嵌入串流。

> [!NOTE]
> 這不是把每一組原始 LSB 都逐一備份。只有被 $M,L,S$ 覆蓋的 $N_P$ 個 parameter pixels 需要備份；一般群組的原始 bit 會在「兩把 key 同時存在」時，透過候選比較重新找回。

## 一個小型容量示例

以下是為了理解公式而設的示範數值，不是論文圖 3 的實驗參數：

$$
N=1000,\quad N_P=20,\quad M=1,\quad L=4,\quad S=1
$$

先扣掉 20 個 parameter pixels：

$$
1000-20=980
$$

每組有 4 個像素，因此可分成：

$$
980\div4=245\text{ groups}
$$

每組產生 1 個空位，總共有 245 個嵌入位置。前 20 個位置拿來備份 parameter pixels 原本的 encrypted LSB：

$$
245-20=225\text{ payload bits}
$$

因此淨嵌入率為：

$$
R=\frac{225}{1000}=0.225\text{ bpp}
$$

兩次出現 $N_P$ 的原因不同：第一次的單位是「像素」，表示這些像素不參與分組；第二次的單位是「bit」，表示要保留多少個嵌入空位來存備份。

## 只有 encryption key 時，為何只能得到近似影像？

資料嵌入只改變 LSB，較高位元 MSB 保持不變。因此直接解密後，影像的大致結構仍在，但最低的 $M$ 個 bit 可能錯誤。

例如，若 $M=1$，原圖像素可能為 103：

```plaintext
原始像素 p  = 103 = 01100111
直接解密 p′ = 102 = 01100110
                           ↑
                   最後一個 LSB 可能不同
```

所以只用 encryption key 時，看得出內容，但不能保證每個像素值都精確。

## 同時有兩把 key 時，怎麼恢復原圖？

先用 data-hiding key 擷取嵌入串流，將前段的 parameter-pixel backups 放回原位，這些 parameter pixels 便可被正確解密。

對於一般群組，壓縮造成每組有 $2^S$ 種可能的原始 LSB 向量。系統把每個候選向量放回去、用 encryption key 解密，並比較哪一個候選結果最符合自然影像「相鄰像素通常接近」的特性。

論文以四個直接解密鄰居估計預測值：

$$
\tilde p_{i,j}=
\frac{
\left\lfloor p'_{i-1,j}/2^M\right\rfloor+
\left\lfloor p'_{i+1,j}/2^M\right\rfloor+
\left\lfloor p'_{i,j-1}/2^M\right\rfloor+
\left\lfloor p'_{i,j+1}/2^M\right\rfloor
}{4}\cdot2^M+2^{M-1}
$$

先除以 $2^M$ 是為了暫時忽略可能被嵌入資料改動的 LSB；乘回 $2^M$ 則是回到原本亮度尺度。接著計算每個候選群組的總差距：

$$
D=\sum_{(i,j)\in G_k}\left|t_{i,j}-\tilde p_{i,j}\right|
$$

差距 $D$ 最小的候選群組，會被視為最可能的原始內容。

這個步驟仰賴自然影像的空間相關性，因此論文也清楚指出：當每組嵌入的資料太多、群組太小，完整復原可能失敗。

## 論文實驗結果說了什麼？

論文以 512×512 的 Lena 圖像為例，設定 $M=3$、$L=128$、$S=2$，嵌入約 $4.4\times10^3$ 個額外 bit，嵌入率為 0.017 bpp。

- 只用 data-hiding key：可擷取嵌入資料，但無法得知影像內容。
- 只用 encryption key：直接解密圖像的 PSNR 為 39.0 dB；可看見影像，但並非每個像素都完全正確。
- 同時使用兩把 key：可擷取資料，並無誤復原原始影像。

論文也比較不同參數與四張測試影像。整體趨勢是：提高 $S$ 或減小 $L$ 可以提高嵌入率，但直接解密品質會下降；較大的 $M,L$ 與較小的 $S$ 較有利於完整復原。

## 我從這篇論文學到的三件事

1. **資料擷取與內容復原可以分離。** 持有 data-hiding key 的人不必先看到原圖，就能拿到額外資料。
2. **LSB 可以當作可管理的空間。** 但要保留被覆蓋的 parameter-pixel LSB，並處理一般群組的復原不確定性。
3. **可逆不代表沒有條件。** 完整復原依賴嵌入量、分組參數與自然影像的空間相關性；它不是對任意設定都保證成功。

## 參考文獻與引用方式

本文引用的原始研究為：

> X. Zhang, “Separable Reversible Data Hiding in Encrypted Image,” *IEEE Transactions on Information Forensics and Security*, vol. 7, no. 2, pp. 826–832, Apr. 2012. DOI: [10.1109/TIFS.2011.2176120](https://doi.org/10.1109/TIFS.2011.2176120)

若你要在報告、論文或其他文章中使用本文整理的方法與實驗結果，請優先引用上述原始論文，而不是只引用這篇閱讀筆記。
