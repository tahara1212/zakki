---
title: "Testing Library のクエリについて"
category: "テスト"
---

# Testing Library のクエリについて
Testing Library には以下の3種類のクエリが存在する。
- getBy*
- queryBy*
- findBy*

## getBy*
`getByRole`や`getByLabelText`などを使用し、特定の条件に一致する要素を取得する際に使用する。
```
it('ul 要素が表示される', () => {
    render(<Skills skills={skills} />);
    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
});
```

## queryBy*
`queryByRole`や`queryByLabelText`などを使用し、特定の条件に一致する要素を取得する際に使用する。  
指定した条件の要素を取得する点に関しては`getBy*`と同じだが、「条件に一致する要素を見つけられなかった場合」の挙動が異なっている。  
`getBy*`で要素が見つからなかった場合、エラーが発生してテストに失敗するが、`queryBy*`は要素が見つからない場合も null を返すため、テストは失敗しない。  
そのため、特定の要素が存在しないことを検証するのに適している。
```
it('ログインボタンが表示されていない', () => {
    render(<Skills skills={skills} />)
    const loginButton = screen.queryByRole('button', { name: "ログアウト"});
    expect(loginButton).not.toBeInTheDocument()
})
```

## findBy*
`findByRole`や`findByLabelText`などを使用し、特定の要素がDOMに存在するまで待機し、その要素を取得する非同期処理のクエリメソッド。  
`findBy*`は Promise を返すため、`await`を使用して待機する必要がある。  
以下は、`setTimeout`で 1500ms秒後に state を更新し、それによって表示されるボタンのテスト。
```
it('1500ms秒後にログアウトボタンが表示される', async () => {
    render(<Skills skills={skills} />);
    const logoutButton = await screen.findByRole(
        'button',
        { 
            name: 'ログアウト' 
        },
        {
            timeout: 2000,
        }
    );
    expect(logoutButton).toBeInTheDocument();
});
```
第三引数に指定した時間の分だけ非同期のテストを実施する。  
デフォルトでは 1000ms なので、今回のように 1500ms秒後に state を更新するような非同期処理の場合、timeout を指定しないとテストに失敗することになる。  

ただし、これは一例であり、実際には setTimeout に関するテストで`findBy*`を使用することはあまりない。  
API に関する処理において使用されることが一般的であり、リクエストが成功した場合に、レスポンスを元にUIが更新される場合、`findBy*`を使用して更新された要素を待つというような用途で使用する。このような用途の場合は、デフォルトの待機時間で十分なことが多い。

## `getByRole`について
`getByRole`はアクセシビリティに基づいて要素を取得するため、指定するロールは WAI-ARIA に定義されたものになる。  
それぞれの要素の役割は以下。

| 要素                       | ロール                 |
|----------------------------|-------------------------------------|
| article                    | article                             |
| button                     | button                              |
| td                         | cell, gridcell                     |
| input(type=checkbox)      | checkbox                            |
| input(type=radio)         | radio                               |
| input(type=search)        | searchbox                           |
| input(type=text)          | textbox                             |
| th                         | columnheader                        |
| select                     | combobox, listbox                  |
| menuitem                   | command, menuitem                  |
| dd                         | definition                          |
| figure                     | figure                              |
| form                       | form                                |
| table                      | grid, table                         |
| fieldset                   | group                               |
| h1 ~ h6                    | heading                             |
| img                        | img                                 |
| a                          | link                                |
| link                       | link                                |
| ol, ul                    | list                                |
| li                         | listitem                            |
| nav                        | navigation                          |
| option                     | option                              |
| frame                      | region                              |
| rel                        | roletype                            |
| tr                         | row                                 |
| tbody, tfoot, thead       | rowgroup                            |
| hr                         | separator                           |
| dt, dfn                   | term                                |
| textarea                   | textbox                             |

#### 特定の要素を絞り込む場合、第二引数を使用する。
```
it('ログインボタンが表示されている', () => {
    render(<Skills skills={skills} />)
    const loginButton = screen.getByRole('button', { name: "ログイン"});
    expect(loginButton).toBeInTheDocument()
})
```
指定するプロパティは以下。  
- name: 要素のアクセス可能な名前（aria-label、aria-labelledby、テキストコンテンツなど）を指定する。
- hidden: boolean を指定し、非表示の要素も含めるかどうかを決定する。
- level: ヘッディング要素（h1、h2など）のレベルを指定する。level: 2とした場合、h2要素を取得する。


## クエリの優先度について
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