---
title: "event.preventDefault"
category: "JavaScript"
---

# event.preventDefault()は何の為にやるのか
`preventDefault()`は、イベントが持つデフォルトの動作をキャンセルする。  
デフォルトの挙動をキャンセルし、代わりにカスタムの動作を実行することができる。

### フォームの送信を防ぐ
フォームの送信ボタンがクリックされたとき、デフォルトでフォームが送信される動作を防ぎたい場合がある。  
e.g. バリデーションを行った後に送信する場合など
```JavaScript
document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); // フォームの送信を防ぐ
    // バリデーション処理
    // 条件が満たされた場合に手動で送信する
});
```

### リンクの遷移を防ぐ
`<a>`タグをクリックしたとき、リンク先に遷移するのを防ぎたい場合がある。  
e.g. JavaScript で特定の処理を実行した後に遷移する場合など
```
document.querySelector('a').addEventListener('click', function(event) {
    event.preventDefault(); // デフォルトのリンク遷移を防ぐ
    // ここで何らかの処理を行う
});
```
`preventDefault()`はイベントオブジェクトのメソッドであり、イベントリスナーのコールバック関数の引数としてイベントオブジェクトが渡される必要がある。上記の例では、イベントオブジェクトを `event`として受け取り、`preventDefault()`を呼び出している。