---
title: "Next.js のビルド成果物"
category: "フロントエンドフレームワーク"
---

## .next

ビルドアーティファクトが格納される場所。next build コマンドで生成できる。

```
.next/
├── cache/
│   └── [キャッシュファイル]
├── server/
│   ├── pages/
│   │   └── [サーバーサイドで使用されるページのビルドファイル]
│   ├── app/
│   │   └── [Next.js 13以降のappディレクトリのビルドファイル]
│   └── [その他サーバー関連のビルドファイル]
├── static/
│   ├── chunks/
│   │   └── [JavaScriptやCSSのチャンクファイル]
│   ├── development/
│   │   └── [開発環境用のビルドファイル]
│   ├── media/
│   │   └── [メディアファイル]
│   └── [その他静的ファイル]
├── traces/
│   └── [トレースファイル]
├── build-manifest.json
├── prerender-manifest.json
├── routes-manifest.json
├── server.js
├── react-loadable-manifest.json
└── [その他のビルド関連ファイル]
```

### `cache/`

- **キャッシュファイル**: コンパイルやビルドの最適化のために使用されるキャッシュファイルが格納されています。これにより、ビルド時間が短縮されます。

### `server/`

- **pages/**: サーバーサイドレンダリング用のページコンポーネントのビルドファイルが含まれます。これらのファイルはサーバー上で実行され、クライアントにHTMLを返します。
- **app/**: Next.js 13以降で導入された`app`ディレクトリのビルドファイルが含まれます。`app`ディレクトリは新しいファイルベースのルーティングシステムを提供します。
- **その他サーバー関連のファイル**: サーバーサイドで必要な他のビルドファイルが含まれます。

### `static/`

- **chunks/**: JavaScriptやCSSのチャンクファイルが含まれます。これらはクライアントサイドで使用され、コードの分割と最適化が行われています。
- **development/**: 開発環境用のビルドファイルが含まれます。これにより、開発中のパフォーマンスが向上します。
- **media/**: 画像やフォントなどのメディアファイルが含まれます。
- **その他静的ファイル**: その他の静的なアセットが格納されます。

### `traces/`

- **トレースファイル**: ビルドや実行時のパフォーマンストレース情報が格納されます。

### `build-manifest.json`

- **ビルドマニフェスト**: ビルドされたモジュールやアセットのマッピング情報が含まれています。

### `prerender-manifest.json`

- **プレンダーマニフェスト**: プリレンダリングされたページやその設定情報が含まれています。

### `routes-manifest.json`

- **ルートマニフェスト**: ルーティングの設定情報が含まれています。

### `server.js`

- **サーバースクリプト**: サーバーサイドのエントリーポイントとなるスクリプトファイルです。

### `react-loadable-manifest.json`

- **React Loadable マニフェスト**: 動的インポートされたモジュールのマッピング情報が含まれています。