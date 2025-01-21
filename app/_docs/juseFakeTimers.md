---
title: "Jest / useFakeTimers"
category: "テスト"
---

## useFakeTimers と user-event
`@testing-library/user-event`を使用して`userEvent.click()`を行った時、このイベントの中のタイマー関数を`useFakeTimers()`で偽装した際にテストがタイムアウトするようになった。  

`userEvent`がデフォルトで入力遅延を持っているらしく、その処理の影響で`useFakeTimers()`が正しく動作しないらしい。  
- https://testing-library.com/docs/user-event/options#advancetimers  
- https://github.com/testing-library/user-event/issues/833  


### 対処方法
以下のように`userEvent`をセットアップする。
```
const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime})
```
`userEvent`は、デフォルトで独自の`advanceTimers`機能を使用して、ユーザーイベントの間に自動的に遅延を発生させている。これは、よりユーザー動作に近い挙動を再現するためであり、`fireEvent`のようにイベントを発火させるだけの API においてはこの問題は発生しない。  

`userEvent.setup`で`advanceTimers`に`jest.advanceTimersByTime`を指定することで、`userEvent`の時間進行に関する設定をフェイクタイマーに向けることができる。  
```
it("userEvent で useFakeTimers を使用する", async () => {
    const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime})
    jest.useFakeTimers();
    render(<Component />);

    await user.click(screen.getByRole("button", { name: "クリック前" }));
    // API の呼び出しを待機して、ボタンの状態が更新されることを確認
    await waitFor(() => {
        expect(screen.getByRole("button", { name: "クリック後" })).toBeInTheDocument();
    });

    jest.useRealTimes();
});
```

## useFakeTimers と 非同期の状態更新
`setTimeout`などで、一定時間経過後に state を更新するような処理をテストするとき、React が何のための状態更新か把握できずに警告を出す。  
```
When testing, code that causes React state updates should be wrapped into act(...):
```
このような場合、状態を更新する際の処理を`act(...)`で囲う必要がある。

### 対処方法
以下のような Toast コンポーネントを用意する。
```
const Toast = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    setTimeout(() => { setIsVisible(false); }, 1000);
  }, []);
  
  return isVisible ? <div>Toast</div> : null;
};
```
このコンポーネントは、初回のレンダリングでは「Toast」を表示し、1000ms後に非表示になる。  
（実際の Toast は再表示のロジックがあるものの、ここでは割愛）  

このコンポーネントのテストを以下のように実施する。
```
it("初回表示から1秒後にトーストが非表示になる", () => {
  jest.useFakeTimers();
  const { queryByText } = render(<Component />);
  jest.advanceTimersByTime(1000);
  expect(queryByText("Toast")).not.toBeInTheDocument();
});
```
このテストの場合、`setTimeout`で1秒後に状態が更新されるが、その処理が行われる際に`act(...)`で囲っていないため、React が状態管理を追跡できない状況に陥って警告が出される。タイマーを進めることが、React にとって更新を引き起こすことを明示しておく必要がある。
```
it("初回表示から1秒後にトーストが非表示になる", () => {
  jest.useFakeTimers();
  const { queryByText } = render(<Component />);

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(queryByText("Toast")).not.toBeInTheDocument();
});
```
`useFakeTimers()`を使用すると、非同期処理を簡単にテストできるようになるが、状態の更新が React のコールスタック外で発生する場合は注意が必要。