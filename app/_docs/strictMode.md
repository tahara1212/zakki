---
title: "既存のTypeScriptプロジェクトでStrictモードを有効化する"
---

### 既存のTypeScriptプロジェクトでStrictモードを有効化する
TypeScript
TypeScript は、strictモードを有効化することで最大の恩恵を受けることが出来るようになります。
しかし、JavaScript からの移行で多数の型エラーが発生するような環境では、暫定的に strictモードを無効にして導入を行うこともあります。

また、初動の開発スピードが求められる環境で、チームの TypeScript 力が発展途上である場合、strictモードを無効にして型エラーに対処する時間を削減し、後続でリファクタリングを行う、というような手法が取られることもあります。

上記のようなケースで、strictモードを無効にした環境で開発がある程度進み、その後に strictモードを切り替える際の手順を解説します。

strictモードについて
strictモードは TypeScript のコンパイラオプションの一つで、tsconfig.jsonファイルにおいてcompilerOptions内でstrictキーを使用して設定を行います。strictモードを有効化すると、一連の型チェックが厳密に行われるようになり、型安全性がコードに適応されます。

{
  "compilerOptions": {
    "strict": true,
    // その他のコンパイラオプション
  }
}
strictモードを有効にすると、以下のようなオプションがすべてtrueになり、厳格な型チェックが行われるようになります。

オプション	影響
noImplicitAny	暗黙的な any 型を許可しない
noImplicitThis	this の暗黙的な any 型を許可しない
strictNullChecks	null と undefined を厳格にチェックし、代入を許可しない
strictFunctionTypes	関数のパラメータと戻り値の型を厳格にチェックし、引数の共変性を許可しない
strictPropertyInitialization	クラスのプロパティがコンストラクタで初期化されていることを保証する
strictBindCallApply	bind、call、apply の型チェックを行い、戻り値の型は呼び出す関数の戻り値型とする
useUnknownInCatchVariables	catch ブロック内の例外変数の型を any から unknown 型として解釈する
