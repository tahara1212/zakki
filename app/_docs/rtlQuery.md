---
title: "RTLのクエリの優先度について"
category: "テスト"
---

# Testing Library のクエリの優先度について
クエリの優先度は、テストがどのように要素を見つけるかに影響を与えます。  
RTLは、最もユーザーフレンドリーな方法で要素にアクセスすることを推奨しています。  
これらはよりアクセシビリティの高いものから優先するということになります。

### ロール（Role）
`getByRole`, `queryByRole`, `findByRole` など。  
ロールは、要素の意味や役割に基づいており、アクセシビリティにも配慮されています。  
実際にユーザーが使用する場面、ユーザーの視点に近いところでテストができるとされており、最も推奨される方法です。  
```
// <button>Submit</button>の場合
getByRole('button', { name: /submit/i })
```

### ラベル（Label）
`getByLabelText`, `queryByLabelText`, `findByLabelText` など。  
フォーム要素など、ラベルに関連付けられた要素を取得するために使用します。  
ロールが要素の役割を参照するのに比べて、ラベルは「ラベルのテキスト」のみで要素を判断します。  
優先度は高めですが、"textbox"や"button"などの要素の役割を完全に参照できるロールの方が優先度は高くなります。
```
// <label htmlFor="username">Username</label><input id="username" />の場合
getByLabelText(/username/i)
```

### Placeholder（Placeholder）
`getByPlaceholderText`, `queryByPlaceholderText`, `findByPlaceholderText` など。
入力要素のプレースホルダーを基に要素を取得します。
```
// <input placeholder="Enter your name" />の場合
getByPlaceholderText(/enter your name/i)
```

### テキスト（Text）
`getByText`, `queryByText`, `findByText` など。
要素内のテキストに基づいて要素を取得します。
```
// <p>Hello, world!</p>の場合
getByText(/hello, world!/i)
```

### タイトル（Title）
`getByTitle`, `queryByTitle`, `findByTitle` など。
要素の title 属性に基づいて要素を取得します。
```
// <div title="Info">Content</div>の場合
getByTitle(/info/i)
```

### テストID（Test ID）
`getByTestId`, `queryByTestId`, `findByTestId` など。
data-testid 属性に基づいて要素を取得します。  
ユーザー体験に何の影響もないパラメータであるため、最も優先度が低いクエリになります。
```
// <div data-testid="custom-element">Content</div>の場合
getByTestId('custom-element')
```