---
title: "NaN について"
category: "JavaScript"
---

# NaN について
NaN は Not-a-Number の略で JavaScript における非数（数字ではないもの）を表しています。  
数値を期待する処理において、結果が数値ではなかった場合の結果に使用されることが多いです。  

## NaN の判定について
NaN は自身と等しくないという特性を持っているため、以下のような結果は false になります。  
```
console.log(NaN === NaN); // false
```
また、NaN は数値型です。
```
console.log(typeof NaN); // "number"
```

文字列を数値に変換する parseInt などの処理を行った際に、渡された文字列を数値に変換できない場合、NaN が生成されます。
```
console.log(parseInt("abc")); // NaN
```
その他にも、無効な数値の演算や、undefined と数値の計算などにおいても NaN が発生します。
```
let x;
console.log(x + 1); // NaN (xがundefinedのため)
console.log(0 / 0); // NaN
console.log(Math.sqrt(-1)); // NaN
```

このような処理の結果が NaN であるかを確認する時は、isNaN 関数や Number.isNaN 関数を使用する必要があります。

### isNaN
引数が NaN または数値に変換できない場合に true を返します。  
例えば、文字列やオブジェクトを渡すと、それらは数値に変換され、その結果が NaN であれば true となります。
```
console.log(isNaN(NaN)); // true
console.log(isNaN("abc")); // true (文字列は数値に変換できない)
console.log(isNaN("123")); // false (文字列は数値に変換できる)
```

### Number.isNaN
Number.isNaN はより厳密な判定を行います。引数が厳密に NaN である時のみ true を返します。    
isNaN と異なり、数値に変換可能な文字列であっても、結果は false となります。
```
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN("abc")); // false
console.log(Number.isNaN(undefined)); // false
console.log(Number.isNaN("123")); // false
```

## 他の値との比較
NaN は数値型であるため、他の数値と比較することができますが、常に false になります。  
NaN は、null や undefined とも異なるため、これらとの比較も false になります。
```
console.log(NaN == null); // false
console.log(NaN == undefined); // false
console.log(NaN === null); // false
```
