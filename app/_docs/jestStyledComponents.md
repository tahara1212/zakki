---
title: "Jest Styled Components について"
category: "テスト"
---

# Jest Styled Components について
Jest を使用して Styled Components をテストするためのユーティリティセット。  
スタイルルールに関するマッチャーを提供したり、スナップショットテストの改善を行う。  

## スタイルルールに対する期待
`toHaveStyleRule()`というマッチャーで、特定のスタイルルールがコンポーネントに適用されているかどうかを検証する。  
第一引数は期待されるプロパティ、第二引数には期待される値を指定する。  
`.not`修飾子と使用される場合、第二引数は省略可能。  
```
test('it applies default styles', () => {
  const tree = renderer.create(<Button />).toJSON()
  expect(tree).toHaveStyleRule('color', 'red')
  expect(tree).toHaveStyleRule('border', '0.05em solid black')
  expect(tree).not.toHaveStyleRule('opacity')
})
```
第三引数はオプショナルで、追加のオプションをオブジェクトで指定する。  
プロパティがネストされている場合や、特定のセレクタを指定する際に使用する。  
```
test('Button has the correct styles', () => {
  const { container } = render(<Button />);

  // メディアクエリ内のスタイルを検証
  expect(container.firstChild).toHaveStyleRule('color', 'green', {
    media: '(max-width: 640px)',
  });

  // 擬似クラスのスタイルを検証
  expect(container.firstChild).toHaveStyleRule('color', 'blue', {
    modifier: ':hover',
  });

  // 子要素の p が active の時のスタイルを検証
  expect(container.firstChild).toHaveStyleRule('color', 'blue', {
    modifier: 'p.active', 
  });
});
```

## スナップショットテストと Styled Components
Jest の標準的なスナップショットテストは、コンポーネントのレンダリング結果をテキスト形式でスナップショットとして保存する。このスナップショットは、コンポーネントの出力をシリアライズしたもの。  
テストが実行されるたびに、現在の出力と保存されたスナップショットを比較し、一致しない場合はテストが失敗する。  
（VRTが画像での視覚的な差分を検知するのに対して、スナップショットテストはプログラムの出力の変更を検知する）  

Styled Components は、CSS を適用する際に自動生成されたユニークなクラス名を使用する。 
このクラス名はハッシュ化されており、スタイルの変更があった場合、異なるクラス名として生成される。  
これにより、標準のスナップショットテストは失敗し、変更を検知できなくなる。  

Jest Styled Components を使用する場合、スナップショットにはクラス名だけでなく、スタイルルールも含まれるようになり、意図しない変更を検出できるようになる。
```
// スナップショットの結果
exports[`Button renders correctly 1`] = `
.button {
  color: red;
}

<button
  className="Button_button__3fLq6"
>
  Click me
</button>
`;
```
以下のテストは、スナップショットにスタイルが含まれるため、Button コンポーネントのスタイルが変更されている場合は失敗する。
```
test('Button renders correctly', () => {
  const { container } = render(<Button />);
  expect(container.firstChild).toMatchSnapshot(); 
});
```
デザイン修正を行う必要がある場合、スナップショットを更新し、意図した変更によってテストが失敗しないようにする。
```
jest --updateSnapshot
```