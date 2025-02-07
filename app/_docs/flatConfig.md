---
title: "Flat Configへの移行"
category: "静的解析"
---

# Flat Configについて
ESLint v9から flat config という新しい設定システムがデフォルトになりました。  
eslintrc は非推奨となり、v10には削除されるそうです。  
ESLint v9でも eslintrc を使用する場合、`ESLINT_USE_FLAT_CONFIG`環境変数を false に設定することで切り替えることが可能ですが、コンソールに非推奨の警告が表示されます。  
flat config へ移行することで、設定をよりシンプルに記述できるようになり、内部パフォーマンスも改善されると言われています。  

## 移行について
移行ガイドが掲載されているため、これに則って作業を進めていきます。  
https://eslint.org/docs/latest/use/configure/migration-guide 

マイグレーションツールが用意されており、以下を実行すると現環境の `eslintrc` の設定を継承した `eslint.config.js` が自動で生成されます。
```
npx  @eslint/migrate-config .eslintrc.json 
```

ESLint. 及びそれに関連するパッケージをアップデートします。  
```
npm install eslint@latest --save-dev
npm install @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint-plugin-import@latest --save-dev
```

`.eslintrc.json`を削除し、ESLint を実行します。  
```
npm run lint
```

以下のようなエラーが発生します。  
```
% npm run lint 

> lint
> eslint "problems/advanced/**/*.ts" --cache


Oops! Something went wrong! :(

ESLint: 8.57.1

Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@eslint/compat' imported from /Users/01047934/Documents/Project/ts-training/eslint.config.mjs
    at packageResolve (node:internal/modules/esm/resolve:853:9)
    at moduleResolve (node:internal/modules/esm/resolve:910:20)
    at defaultResolve (node:internal/modules/esm/resolve:1130:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:396:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:365:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:240:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:85:39)
```

`@eslint/compat`というパッケージのインストールが求められているので、このパッケージが何なのかを調べます。  
https://www.npmjs.com/package/@eslint/compat
要するに、`eslintrc`形式から flat config への移行を実施する際に、既存のプラグインやルールをラップして flat config で動作させるための関数が含まれているようです。  

`eslint.config.js`の中身は以下です。
```
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["problems/advanced/1/src/lib/renderBarGraph.ts"],
  },
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
      "prettier",
    ),
  ),
  {
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      "import/extensions": [".js", ".ts"],
    },

    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "no-console": "error",

      "import/order": [
        "error",
        {
          "newlines-between": "always",

          alphabetize: {
            order: "asc",
          },
        },
      ],
    },
  },
];
```

`fixupConfigRules`について確認します。これは `@eslint/compat`が提供している関数で、設定オブジェクトの配列内で見つかったすべてのプラグインをラップしてくれているようです。  
順を追って見ていきます。  

### `fixupConfigRules()`
設定オブジェクトの配列内で見つかったすべてのプラグインを`fixupPluginRules()`を使用してラップします。

### `fixupPluginRules()`
指定されたプラグイン内の各ルールを`fixupRule()`を使用してラップし、修正されたルールを持つプラグインを表す新しいオブジェクトを返します。

### `fixupRule()`
指定されたルールを互換性レイヤーでラップし、結果を返します。

`fixupConfigRules(configs)`が各設定のオブジェクトをループしてプラグインを探し出し、`fixupPluginRules(plugin)`がプラグインが提供するルールをループします。  
`fixupRule(rule)`が指定されたルールを互換性レイヤーでラップし、`flat config`と互換性を持つよう調整されます。  

問題なさそうなので、`@eslint/compat`をインストールします。
```
npm install @eslint/compat --save-dev
```
改めて、ESLint を実行し、動作確認を実施します。  
```
npm run lint
```

既存のソースコードから新たな差分は発生しなかったので、既存ルールの`prefer-const`などを意図的に発火させて動作検証を行います。  
```
86:7  error  'test' is never reassigned. Use 'const' instead  prefer-const
86:7  error  'test' is assigned a value but never used        @typescript-eslint/no-unused-vars
```

問題なさそうなので、`no-console`ルールを追加して動作検証を行います。
```
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "no-console": "error",

      "import/order": [
        "error",
        {
          "newlines-between": "always",

          alphabetize: {
            order: "asc",
          },
        },
      ],
    },
```
問題なく動作しているので、アップデートは無事完了してそうです。
```
85:3  error  Unexpected console statement  no-console
```

今回は導入しているパッケージや、ルールが極端に少なかったため、移行につまづくことはありませんでした。  
実際には`@eslint/compat`がラップしきれないルールがあるようなので、そのような問題に直面すると自前でルールを書く必要などが出てきそうです。