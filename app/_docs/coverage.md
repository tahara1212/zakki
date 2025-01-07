---
title: "カバレッジレポート"
category: "テスト"
---

# カバレッジレポート

### 設定について
Jest のカバレッジ設定を行う場合、`jest.config.js` または`package.json`の`jest`セクションのいずれかに記載することができる。  
Jest の設定はどちらかに統一することが推奨され、設定が多くなる場合などは`jest.config.js`をルートディレクトリに作成しておくと便利。  
```
module.exports = {
  preset: "ts-jest",
  transformIgnorePatterns: ["/node_modules/(?!three/examples/)"],
  transform: {
    "node_modules/three/examples/.+.(j|t)sx?$": "ts-jest",
  },
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  collectCoverage: true, // カバレッジを収集する
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}", // カバレッジを収集するファイルのパターン
    "!src/index.tsx", // 除外するファイルの例
    "!src/**/*.d.ts", // 型定義ファイルを除外
  ],
  coverageDirectory: "coverage", // カバレッジレポートの出力先
  coverageThreshold: {
    global: {
      statements: 80, // ステートメントカバレッジが80%未満の場合、テストは失敗
      branches: 80,    // ブランチカバレッジが80%未満の場合、テストは失敗
      functions: 80,   // 関数カバレッジが80%未満の場合、テストは失敗
      lines: 80,       // 行カバレッジが80%未満の場合、テストは失敗
    },
  },
};
```

### collectCoverage
カバレッジを収集するかどうかを決定する。  
true の場合、テスト実行時にカバレッジレポートが出力されるようになる。

### collectCoverageFrom
カバレッジを収集するファイルのパターンや、除外するファイルのパスを指定する。

### coverageDirectory
カバレッジレポートの出力先。  
指定したディレクトリにカバレッジレポートの結果が出力され、  
`open coverage/lcov-report/index.html`などのコマンドを使用することでブラウザ上でも結果を確認できる。

### coverageThreshold
カバレッジの閾値を設定する。この設定によって、プロジェクト内のテストカバレッジが一定の基準を満たさない場合にテストを失敗させることができる。

## カバレッジレポートの構成

### Stmts（命令網羅率）
全てのステートメント（命令）が一回実行されたかを示す。

### Branch（分岐網羅率）
`if`文や`case`文、三項演算子などの分岐処理において、全ての条件分岐が少なくとも一回通過したか、を示す。

### Funcs（関数網羅率）
全ての関数が一回実行されたかを示す。プロジェクトで利用されていないが、`export`されている関数を発見するのに役立つ。

### Lines（行網羅率）
全ての行を一回通過したかを示す。

### Stmts と Lines の違い
以下のような処理がある場合。
```
if (x < 10) { hoge() }
```
`x`が9である場合、条件は`true`になり、Stmts、Lines 共に 100% となる。  
`x`が11である場合、、条件は`false`になり、命令が実行されないため、Stmts は50%となり、Lines は100%となる。