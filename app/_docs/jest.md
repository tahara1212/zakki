---
title: "Jest / 基本的なマッチャー"
category: "テスト"
---

# Jest の基礎

### `toBe()`と**`toEqual()`**

`toB()`は厳密等価比較であり、JavaScript の`===` と同様。

参照先までが完全に一致する場合に真と評価するため、プリミティブ値の比較に適している。

`toEqual()` はオブジェクトや配列の中身が等しいかをチェックする。

```jsx
// 配列の中身は等しいが、異なるインスタンスであるためこのテストは失敗する
const arr1 = [1, 2, 3]
const arr2 = [1, 2, 3]
expect(arr1).toBe(arr2)

// 配列の中身は等しく、厳密等価比較ではないためこのテストは成功する
const arr1 = [1, 2, 3]
const arr2 = [1, 2, 3]
expect(arr1).toEqual(arr2)
```

`toEqual()`は値の深い比較を行うが、プリミティブ値の場合は直接比較が行われ、以下のテストは成功する。

```jsx
const a = "a"
const b = "a"
expect(a).toEqual(b)
```

ただし、厳密等価比較を明示的に行う意味でも、プリミティブ値の比較は`toBe` を使用すべきである。

### `not()`

値が異なることを示す場合は`not()` を使用する。

マッチャー関数に`not()`を前置することで、そのマッチャーの逆の結果を期待するテストを書くことができる。

```jsx
// aとbの内容は同じでも異なるオブジェクトであるため、このテストは成功する
const a = { name: "Alice" };
const b = { name: "Alice" };
expect(a).not.toBe(b);

// aとbは異なる内容のオブジェクトであるため、このテストは成功する
const a = { name: "Alice" };
const b = { name: "Bob" };
expect(a).not.toEqual(b);
```

### 数値の検証

### `toBeGreaterThan()`

大なり比較を行う。`toBeGreaterThan(3)` であれば 4 > 3 を検証する。

### `toBeGreaterThanOrEqual()`

 大なり比較を行う。`toBeGreaterThan(4)` であれば 4 >= 4 を検証する。

### `toBeLessThan()`

小なり比較を行う。`toBeLessThan(5)` であれば 4 < 5 を検証する。

### `toBeLessThanOrEqual()`

 小なり比較を行う。`toBeLessThan(4)` であれば 4 <= 4 を検証する。

### `toBeCloseTo()`

少数計算を行う。`toBeCloseTo(0.3)` であれば小数点以下2桁を検証する。

### 文字列の検証

### `toContain()`

文字列の部分一致を検証する。

### `toMatch()`

正規表現での比較を行う。`expect(str).toMatch(/文字列/)` などで部分一致を検証する。

### `toHaveLength()`

文字列の長さを検証する。`expect(str).toHaveLength(7)`

### `stringContaining()`

オブジェクトに含まれる文字列の部分一致を検証する。

### `stringMatching()`

オブジェクトに含まれる文字列の部分一致を正規表現で検証する。

### 配列の検証

### `toContain()`

配列に特定のプリミティブが含まれているかを検証する。

### `toHaveLength()`
配列の要素数を検証する。
```jsx
const tags = ["Jest", "Storybook", "Playwright", "React", "Next. js"]; 
test("toContain", () => { 
  expect(tags).toContain("Jest"); 
  expect(tags).toHaveLength(5); 
});
```

### `toHaveAttribute()`
要素の属性をテストする。  
例えば、テキスト入力要素がパスワードなのかどうかどうかは以下のように判定する。
```
test('パスワード非表示'である, () => {
  render(
    <TextInput />
  );
  expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
});
```

### `toContainEqual()`

配列に特定のオブジェクトが含まれているかを検証する。

### `arrayContaining()`

引数に与えた配列要素が全て含まれているかを検証する。

```jsx
const article1 = { author: "taro", title: "Testing Next. js" }; 
const article2 = { author: "jiro", title: "Storybook play function" }; 
const article3 = { author: "hanako", title: "Visual Regression Testing " }; 
const articles = [article1, article2, article3];

test("toContainEqual", () => { 
	expect( articles).toContainEqual(article1);
}); 
test("arrayContaining", () => { 
	expect( articles). toEqual( expect. arrayContaining([ article1, article3]));
});
```

### 真偽値の検証

### `toBeTruthy()`

真である値に一致する。

### `toBeFalsy()`

偽である値に一致する。

```jsx
it("真の値の検証", () => {
  expect(1).toBeTruthy();
  expect("1").toBeTruthy();
  expect(true).toBeTruthy();
});

it("偽の値の検証", () => {
  expect(0).toBeFalsy();
  expect("").toBeFalsy();
  expect(false).toBeFalsy();
});
```

### `toBeNull()`

null であることを検証する。

### `toBeUndefined()`

undefined であることを検証する。

### オブジェクトの検証

### `toMatchObject()`

プロパティが部分的に一致するか検証する。

### `toHaveProperty()`

特定のプロパティが存在するか検証する。

```jsx
const tahara = { name: "pe", age: 28 };
test("toMatchObject", () => {
	expect(tahara).toMatchObject({ name: "pe" }); // 部分一致
	expect(tahara).not.toMatchObject({ gender: "man" }); // 一致しないプロパティ
});
test("toHaveProperty", () => {
	expect(tahara).toHaveProperty("name");
});
```

### `objectContaining()`

オブジェクトに含まれるオブジェクトを検証する。

```jsx
const article = {
	title: "Testing with Jest", 
	author: { name: "taroyamada", age: 38 }, 
};
test("objectContaining", () => {
	expect( article).toEqual({ 
		title: "Testing with Jest", 
		author: expect.objectContaining({ name: "taroyamada" }),
  }); 
});
```

### 例外処理の検証

### `toThrow()`

関数が実行された際に例外が投げられることをテストする。

エラーハンドリングのロジックが期待通りに機能しているか、特定の条件下でアプリケーションが適切に例外を報告するかを検証する。

```jsx
// 関数を直接呼び出すのではなく、関数を実行するラッパー関数（アロー関数）を expect に渡す
expect(() => {
  someFunction();
}).toThrow();
```

任意のエラーが投げられることだけでなく、特定のエラーメッセージや特定の型のエラーが投げられることを検証するためにも使用できる。

```jsx
// エラーメッセージを指定
expect(() => {
  someFunction();
}).toThrow('特定のエラーメッセージ');

// エラーオブジェクトの型を指定
expect(() => {
  someFunction();
}).toThrow(ErrorType);
```

 `toThrow()`を使用する際は、関数が実行されることを確実にするためにラッパー関数を使用する。ラッパー関数を使用しない場合、関数が`expect`の呼び出し前に実行され、期待通りにテストが機能しない。

```jsx
// 正しくない書き方 
expect(add(-10, 110)).toThrow(); 

// 正しい書き方 
expect(() => add(-10, 110)).toThrow();
```

拡張した Error クラスを活用した例は以下の通り。

HttpError と RangeError から生成するインスタンスは、`instanceof` 演算子を使用して異なるインスタンスとして分別できる。

```jsx
export class HttpError extends Error {}
export class RangeError extends Error {} 

if (err instanceof HttpError) { // 捉えた例外がHttpErrorインスタンスだった場合 }
if (err instanceof RangeError) { // 捉えた例外がRangeErrorインスタンスだった場合 }
```

この拡張クラスに対しての入力チェック。条件文を Error クラスで管理できるようになり、可読性の高い実装になる。

```jsx
function checkRange(value: number) {
  if (value < 0 || value > 100) {
    throw new RangeError("入力値は0〜100の間で入力してください");
  }
}

export function add(a: number, b: number) {
  checkRange(a);
  checkRange(b);
  const sum = a + b;
  if (sum > 100) {
    return 100;
  }
  return a + b;
}
```

次のように、`toThrow` マッチャーの引数にメッセージではなくクラスを与えることで、スローされた例外が該当クラスのインスタンスであるかを検証できる。

```jsx
// スローされる例外はRangeErrorなので失敗する 
expect(() => add(110, -10)).toThrow(HttpError); 
// スローされる例外はRangeErrorなので成功する 
expect(() => add(110, -10)).toThrow(RangeError); 
// スローされる例外はErrorの派生クラスなので成功する 
expect(() => add(110, -10)).toThrow(Error);
```

### 非同期関数の検証

非同期処理のテストでは、非同期処理の完了を待ってからテストを実行する。

非同期処理を正しく待たずにテストを実施した場合、テストは失敗するか、誤った結果を返す。

```jsx
// async/await を使用して非同期テストを行う
it('async/awaitを使った非同期テスト', async () => {
  const data = await someAsyncFunction();
  expect(data).toBe('期待される値');
});

// 非同期処理がPromiseを使用している場合、そのPromiseが解決されるのを待ってからテストを行う
it('Promiseを使った非同期テスト', () => {
  return someAsyncFunction().then(data => {
    expect(data).toBe('期待される値');
  });
});

// resolves を使用して関数が resolve した時の値を検証する
it("指定時間待つと、経過時間をもって resolveされる", () => {
  return expect(wait(50)).resolves.toBe(50); 
});

// reject を検証する場合：catch メソッドに渡す関数内にアサーションを書く 
test("指定時間待つと、経過時間をもって rejectされる", () => { 
	return timeout(50).catch((duration) => { 
		expect( duration).toBe(50); 
	});
});

// reject を検証する場合：rejects マッチャーを使用する
test("指定時間待つと、経過時間をもって rejectされる", () => { 
	return expect(timeout(50)).rejects.toBe( 50); 
}); 

test("指定時間待つと、経過時間をもって rejectされる", async () => {
	await expect(timeout(50)).rejects.toBe( 50); 
});
```

・非同期処理を含むテストは、テスト関数を async関数で書く 

・. resolvesや. rejectsを含むアサーションは awaitする 

・try... catch文による例外スローを検証する場合、 expect. assertionsを書く

### 関数がどのように呼び出されたかを確認する

### **`toHaveBeenCalledTimes()`**

モック関数が特定の回数だけ呼び出されたことを確認するためのマッチャー。

関数が期待された回数だけ呼び出されたことを確認したい場合に使用。

特定の条件下で関数が適切に呼び出されているか、または過剰に呼び出されていないかを確認する場合に有用。

```jsx
const mockFn = jest.fn();

// 関数を2回呼び出す
mockFn();
mockFn();

// 関数が2回呼び出されたことを確認
expect(mockFn).toHaveBeenCalledTimes(2);
```

### **`toHaveBeenNthCalledWith()`**

モック関数が特定の呼び出し回数目にどの引数で呼び出されたかを確認するためのマッチャー。

特定の順序で関数が呼び出されることが重要なテストシナリオで有用。

複数回呼び出される関数の特定の呼び出し回数目が、期待通りの引数で呼び出されたことを確認したい場合に使用。

```jsx
const mockFn = jest.fn();

// 関数を3回呼び出す
mockFn('first call');
mockFn('second call');
mockFn('third call');

// 2回目の呼び出しの引数が 'second call' であったことを確認
expect(mockFn).toHaveBeenNthCalledWith(2, 'second call');
```

### **`toHaveBeenCalledWith()`**

関数が特定の引数で呼び出されたことを確認したい場合に使用するマッチャー。

呼び出し回数に関わらず、特定の引数で関数が呼び出されることが重要なテストシナリオで有用。

### it と test の違い
Jest において、it と test はほぼ同じ機能を持っている。  
it はより自然言語に近い表現で、テストが「何をするか」を説明するのに適している。  
test は形式的なテストケースの定義として使われることが多い。  
