---
title: "microCMS APIのレートリミットとRetryによる遅延をSentryで検知・通知する"
category: "パフォーマンス最適化"
---

# Sentry JavaScript SDK 8.x 新トレーシングAPI完全ガイド：Next.jsのルート変更パフォーマンス計測実装

## はじめに

Webアプリケーションのパフォーマンス監視は、ユーザー体験の向上において重要な要素です。特にNext.jsのようなシングルページアプリケーション（SPA）では、ページ遷移時のローディング時間がユーザビリティに大きく影響します。

今回は、Sentry JavaScript SDK 8.xで導入された新しいトレーシングAPIを使用して、Next.jsアプリケーションのルート変更時のパフォーマンスを詳細に監視する方法を解説します。

## Sentry SDK 8.x の新トレーシングAPI概要

### 従来のAPIからの変更点

Sentry SDK 8.xでは、パフォーマンス監視のアーキテクチャが大幅に刷新されました。

**従来（7.x以前）:**
```javascript
// 非推奨となったAPI
const transaction = Sentry.startTransaction({
  name: "my-operation",
  op: "navigation"
});
const span = transaction.startChild({
  op: "child-operation"
});
span.finish();
transaction.finish();
```

**新しいAPI（8.x）:**
```javascript
// 推奨される新しいAPI
Sentry.startSpan({ name: "my-operation" }, (span) => {
  // 自動的にスパンが終了される
});
```

### 新しいAPI の3つの主要メソッド

1. **`startSpan()`** - 最も一般的な用途。コールバック終了時に自動でスパンを終了
2. **`startSpanManual()`** - 手動でスパンを終了したい場合に使用
3. **`startInactiveSpan()`** - アクティブにならないスパンを作成

## Next.jsローディング時間計測の実装

### 基本実装

まず、Next.jsの`useRouter`フックを使用してルート変更イベントを監視する基本的な実装から始めます。

```typescript
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export const LoadingContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let currentSpan: ReturnType<typeof Sentry.startInactiveSpan> | null = null;
    let loadingStartTime: number = 0;

    const handleStart = (url: string) => {
      setIsLoading(true);
      loadingStartTime = Date.now();
      
      // Sentryスパン開始
      currentSpan = Sentry.startInactiveSpan({
        name: `Route Change: ${url}`,
        op: 'navigation',
        attributes: {
          'route.from': router.asPath,
          'route.to': url,
        },
      });
    };

    // イベントリスナー登録
    router.events.on("routeChangeStart", handleStart);
    // ... 他のイベントハンドラー
  }, [router.events, router.asPath]);

  return <>{children}</>;
};
```

### 型安全な詳細実装

より本格的な監視システムを構築するために、型安全性とエラーハンドリングを強化した実装を作成しました。

```typescript
import type { Span } from '@sentry/types';

const handleComplete = (url?: string) => {
  setIsLoading(false);
  
  if (currentSpan && loadingStartTime > 0) {
    const loadingDuration = Date.now() - loadingStartTime;
    
    // パフォーマンス属性の設定
    currentSpan.setAttribute('loading.duration', loadingDuration);
    currentSpan.setAttribute('loading.route', url || router.asPath);
    
    // 成功ステータス設定
    currentSpan.setStatus('ok');
    
    // メトリクス送信
    Sentry.metrics.distribution('route.loading.duration', loadingDuration, {
      unit: 'millisecond',
      tags: {
        route: url || router.asPath,
        loading_type: 'route_change',
      },
    });
    
    // パフォーマンス閾値による分類
    if (loadingDuration > 3000) {
      currentSpan.setAttribute('loading.is_slow', true);
      Sentry.addBreadcrumb({
        message: `Slow route change: ${loadingDuration}ms`,
        level: 'warning',
        category: 'performance',
      });
    }
    
    currentSpan.end();
  }
};
```

## 重要な実装ポイント

### 1. スパンの種類選択

今回の実装では`startInactiveSpan()`を選択しました。理由は以下の通りです：

- **手動制御が必要**: ルート変更は非同期処理のため、コールバックベースの`startSpan()`では制御が困難
- **長時間実行**: ページ読み込み時間は予測不可能なため、手動での終了制御が必要
- **イベント駆動**: Next.jsのルーターイベントに基づく処理のため

### 2. エラーハンドリング

```typescript
const handleError = (error: Error, url: string) => {
  if (currentSpan) {
    // エラー情報をスパンに記録
    currentSpan.setAttribute('loading.error', true);
    currentSpan.setAttribute('loading.error_message', error.message);
    currentSpan.setStatus('internal_error');
    
    // 詳細なエラー情報をSentryに送信
    Sentry.captureException(error, {
      tags: { component: 'LoadingContextProvider' },
      contexts: {
        route_change: {
          from: router.asPath,
          to: url,
          loading_duration: Date.now() - loadingStartTime,
        },
      },
    });
    
    currentSpan.end();
  }
};
```

### 3. メモリリーク対策

```typescript
return () => {
  // イベントリスナーの適切な削除
  router.events.off("routeChangeStart", handleStart);
  router.events.off("routeChangeComplete", handleComplete);
  router.events.off("routeChangeError", handleError);
  
  // 未完了スパンのクリーンアップ
  if (currentSpan) {
    currentSpan.setAttribute('loading.cleanup', true);
    currentSpan.setStatus('internal_error');
    currentSpan.end();
  }
};
```

## 旧APIからの移行時の注意点

### 1. setStatus()メソッドの変更

旧APIでは`setStatus()`にオブジェクトを渡していましたが、新APIでは文字列を渡します。

```typescript
// ❌ 旧API（エラーになる）
span.setStatus({
  code: 2,
  message: 'Error occurred'
});

// ✅ 新API
span.setStatus('internal_error');
```

### 2. 属性設定の変更

```typescript
// ❌ 旧API
span.setTag('route', '/users');
span.setData('duration', 1000);

// ✅ 新API
span.setAttribute('route', '/users');
span.setAttribute('duration', 1000);
```

### 3. 測定値の設定

```typescript
// ❌ 旧API
transaction.setMeasurement('loading_time', duration, 'millisecond');

// ✅ 新API
Sentry.setMeasurement('loading_time', duration, 'millisecond');
```

## Sentryダッシュボードでの確認方法

実装後、Sentryダッシュボードで以下の情報を確認できます：

### 1. Performance タブ
- トランザクション一覧で「Route Change: /path」形式のエントリを確認
- 各ルート変更の詳細な時間計測とウォーターフォール表示

### 2. Metrics タブ
- `route.loading.duration`でローディング時間の分布を確認
- ルート別、時間帯別のパフォーマンス傾向を分析

### 3. Issues タブ
- ルート変更時のエラーを詳細情報付きで確認
- エラー発生パターンの分析

## パフォーマンス最適化のためのベストプラクティス

### 1. 適切な閾値設定
```typescript
// 段階的な警告レベル設定
if (loadingDuration > 5000) {
  // 重大な遅延
  currentSpan.setAttribute('loading.severity', 'critical');
} else if (loadingDuration > 3000) {
  // 注意が必要な遅延
  currentSpan.setAttribute('loading.severity', 'warning');
} else if (loadingDuration > 1000) {
  // 軽微な遅延
  currentSpan.setAttribute('loading.severity', 'info');
}
```

### 2. サンプリング戦略
```typescript
Sentry.init({
  tracesSampler: (samplingContext) => {
    // 特定のルートは高頻度でサンプリング
    if (samplingContext.attributes?.['route.to']?.includes('/critical-page')) {
      return 1.0; // 100%サンプリング
    }
    return 0.1; // 通常は10%サンプリング
  }
});
```

### 3. コンテキスト情報の充実
```typescript
currentSpan.setAttribute('user.type', userType);
currentSpan.setAttribute('device.type', deviceType);
currentSpan.setAttribute('network.type', connectionType);
```

## まとめ

Sentry JavaScript SDK 8.xの新しいトレーシングAPIを使用することで、Next.jsアプリケーションのルート変更パフォーマンスを詳細に監視できるようになりました。

**主な利点:**
- より直感的で型安全なAPI
- OpenTelemetryとの互換性向上
- 詳細なパフォーマンス分析機能
- エラー情報との統合監視

**実装時の重要ポイント:**
- 適切なスパンタイプの選択（`startInactiveSpan`）
- メモリリーク対策の実装
- 段階的な警告レベル設定
- 旧APIからの正しい移行

この実装により、ユーザー体験に直結するルート変更のパフォーマンスを継続的に監視し、改善につなげることができます。パフォーマンス問題の早期発見と解決に向けて、ぜひ参考にしてください。