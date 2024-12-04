---
title: "モックについて"
category: "テスト"
---

# モックについて

・定められた値を返却するもの

・テスト対象に「入力」を与えるためのもの

スタブは、テスト対象が依存しているコンポーネントに、何らかの不都合がある場合に使用します。例えば、 Web APIに依存しているテスト対象を検証するときです。「 Web APIからこんな値が返ってきた場合、このように動作する」というテストでスタブを使用します。テスト対象がスタブにアクセスすると、スタブは定められた値を返却します。

![スクリーンショット 2024-10-15 10.23.56.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4fc61ac9-b4cf-4a6f-b4b2-c624a50e6c56/ca8c1728-5dc8-4b36-bcca-4d063739a480/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2024-10-15_10.23.56.png)

### スパイ

スパイの主な目的は「記録」を行うこと。

・関数やメソッドの呼び出しを記録するオブジェクト

・呼び出された回数、実行時引数を記録するもの

・テスト対象からの「出力」を確認するためのもの 　

スパイは、テスト対象から外側に向けた出力の検証に利用します。例えば、関数引数のコールバック関数です。コールバック関数が実行された「回数」「実行時引数」を記録しているので、意図通りの呼び出しが行われたかを検証できます。

![スクリーンショット 2024-10-15 10.26.59.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4fc61ac9-b4cf-4a6f-b4b2-c624a50e6c56/00f850d4-d6a4-411f-b9ab-a465b11a1d2e/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2024-10-15_10.26.59.png)

### モックモジュールを使ったスタブ

都合の悪い依存モジュールなどを、スタブに置き換える。

![スクリーンショット 2024-11-13 10.07.58.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4fc61ac9-b4cf-4a6f-b4b2-c624a50e6c56/1feffa6d-a5b5-4dd3-87df-12015fd60993/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2024-11-13_10.07.58.png)

以下のような挨拶をリターンする関数をテストする。

```jsx
export function greet( name: string) {
  return ` Hello! ${ name}. `; 
} 

export function sayGoodBye( name: string) {
  throw new Error("未実装"); 
}
```

`jest.mock(”./greet”)` をテストファイルの冒頭で実行した時、対象モジュールが置き換わり、以下のようなテストは本来の結果と異なる undefined を返すようになります。

```jsx
test("挨拶を返さない", () => {
	expect(greet("Taro")).toBe(undefined);
});
```

`sayGoodBye` 関数は未実装ですが、以下のように置き換えることで、都合の悪いモジュールもテストできるようになります。

```jsx
import { greet } from "./greet"; 

jest. mock("./greet", () => ({
	sayGoodBye: (name: string) => ` Good bye, ${ name}. `,
})); 

test("さよならを返す（本来の実装ではない）", () => { 
	const message = `${ sayGoodBye("Taro")} See you. `; 
	expect( message). toBe("Good bye, Taro. See you."); 
});
```

本来実装済みの greet 関数が undefined を返すままなので、本来の実装のまま import を行います。`jest.requireActual` という関数を使用して、モジュール本来の実装を import し、`sayGoodBye` 関数のみを代用品に置き換えます。

```jsx
import { greet, sayGoodBye } from "./ greet"; 

jest. mock("./greet", () => ({
	...jest.requireActual("./greet"),
	sayGoodBye: (name: string) => ` Good bye, ${ name}. `,
})); 

test("挨拶を返す（本来の実装通り）", () => { 
	expect( greet(" taro")).toBe(" Hello! taro"); 
}); 

test("さよならを返す（本来の実装ではない）", () => { 
	const message = `${ sayGoodBye(" Taro")} See you. `; 
	expect( message). toBe(" Good bye, Taro. See you."); 
});
```

### Web API のモック基礎

`jest.spyOn` は TypeScript と親和性の高いモック機能で、対象のオブジェクトをスパイ（監視）し、メソッドがどのように呼ばれたのかを追跡します。もし対象のオブジェクトに定義されていないメソッドを指定した場合、型エラーとなります。

データ取得が成功した場合に、期待するレスポンス相当のオブジェクトを `mockResolvedValueOnce` で指定します。

```jsx
jest.spyOn( Fetchers, "getMyProfile").mockResolvedValueOnce({
	id: "xxxxxxx-123456", 
	email: "taroyamada@ myapi. testing. com", 
});
```

### データ取得失敗を再現するテスト

reject を再現するスタブを、`mockRejectedValueOnce` で実装します。`httpError` に定義したエラーオブジェクトを指定します。

```jsx
jest.spyOn(Fetchers, "getMyProfile").mockRejectedValueOnce(httpError);
```

以下のようにテストできます。

```jsx
test("データ取得失敗時", async () => { 
// getMyProfileが rejectされたときの値を再現 
jest.spyOn(Fetchers, "getMyProfile").mockRejectedValueOnce(httpError); 
	await expect(getGreet()).rejects.toMatchObject({
		err: { message: "internal server error" },
	});
});
```

### レスポンスを切り替えるモック生成関数

Web API クライアントを利用した関数のレスポンスを再現するテスト用のデータをフィクスチャーと呼びます。

モック生成関数を用意して、必要最小限のパラメータで切り替え可能にしたユーティリティ関数を実装します。

```jsx
function mockGetMyArticles(status = 200) { 
	if (status > 299) { 
		return jest
			.spyOn(Fetchers, "getMyArticles")
			.mockRejectedValueOnce(httpError); 
	} 
	return jest 
		.spyOn(Fetchers, "getMyArticles") 
		.mockResolvedValueOnce(getMyArticlesData);  // フィクスチャー
}
```

このモック生成関数を使用することで、引数のステータスコードでレスポンスの分岐を再現できます。`mockGetMyArticles(500)` とすれば、サーバーエラーを検証します。

```jsx
test("データ取得に失敗した場合、 rejectされる", async () => { 
	mockGetMyArticles( 500); 
	await getMyArticleLinksByCategory("testing").catch((err) => {
		expect(err).toMatchObject({ 
			err: { message: "internal server error" }, 
		}); 
	}); 
});
```

モック生成関数の`mockGetMyArticles` の中で`mockResolvedValueOnce` を使用しています。

`mockResolvedValueOnce`は、特定の呼び出しに対して Promise が解決される際に返す値を指定するために使用されます。このメソッドは、通常の `mockResolvedValue` とは異なり、一度だけ有効で、その後の呼び出しではデフォルトの動作または別のモック値を使用します。

`mockResolvedValueOnce` にフィクスチャーを指定していることで、以下のようなテストでは、フィクスチャーのテスト用データが参照されます。

```
test("指定したタグを持つ記事が一件以上ある場合、リンク一覧が返る", async () => { 
	mockGetMyArticles(); 
	const data = await getMyArticleLinksByCategory("testing"); 
	expect(data).toMatchObject([
		{ 
			link: "/ articles/ howto-testing-with-typescript", 
			title: "TypeScriptを使ったテストの書き方", 
		}, 
		{ 
			link: "/ articles/ react-component-testing-with-jest", 
			title: "Jestではじめる Reactのコンポーネントテスト", 
		}, 
	]); 
});
```