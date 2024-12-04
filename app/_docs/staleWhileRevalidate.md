---
title: "stale-while-revalidate について"
---

HTTPのキャッシュ制御ディレクティブの一つ。これにより、キャッシュされたリソースが期限切れになった後でも一定期間は古いキャッシュを使いつつ、バックグラウンドで新しいリソースを取得・検証することができます。このディレクティブは、HTTPレスポンスの`Cache-Control` ヘッダーに設定します。

## 効果的な使用例

### 1. 高トラフィックのウェブサイト

高トラフィックのウェブサイトでは、多くのユーザーが同時にリクエストを送信します。このような場合、キャッシュの有効期限が切れた瞬間に全てのリクエストがサーバーに集中すると、サーバー負荷が急激に高まることがあります。`stale-while-revalidate` を使用すると、古いキャッシュを提供しつつバックグラウンドで新しいデータを取得するため、サーバーへの負荷を分散させることができます。

### 2. リアルタイム性がそれほど重要でないデータ

ニュースサイトやブログなど、ある程度の遅延が許容されるデータに対しては、`stale-while-revalidate` が非常に効果的です。ユーザーは古いデータでもすぐに表示されるため、ページの読み込みが速く感じられます。同時に、バックグラウンドで新しいデータが取得されるため、次回以降のリクエストは最新のデータを提供できます。

### 3. 外部APIのデータ取得

外部APIからデータを取得する場合、APIのレスポンスが遅いことがあります。`stale-while-revalidate` を使うことで、古いキャッシュデータをすぐに提供し、バックグラウンドで新しいデータを取得することで、ユーザー体験を向上させることができます。

### 4. 静的リソースの配信

CSSやJavaScriptなどの静的リソースに対しても効果的です。これらのファイルは頻繁に更新されないことが多いため、`stale-while-revalidate` を利用して古いキャッシュを提供しつつ、新しいリソースをバックグラウンドで取得することで、リロード時のパフォーマンスを最適化できます。

### 5. モバイルアプリケーション

モバイルアプリケーションでも、`stale-while-revalidate` を利用することでユーザーエクスペリエンスを向上させることができます。特に低速なネットワーク環境下では、古いキャッシュを使って即座にコンテンツを表示しつつ、新しいデータをバックグラウンドで取得することで、アプリのレスポンスを改善できます。