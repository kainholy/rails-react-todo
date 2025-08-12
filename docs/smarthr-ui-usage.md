# SmartHR-UI 使用方法ガイド

## 概要

SmartHR UI は、SmartHR の全アプリケーションの UI コンポーネントを共通化して、開発生産性や完成度を向上させるための UI コンポーネントライブラリです。

[![npm version](https://badge.fury.io/js/smarthr-ui.svg)](https://badge.fury.io/js/smarthr-ui)

## インストール

### 基本インストール

SmartHR-UI は npm パッケージとして提供されています。

```sh
# npm を使用する場合
npm install smarthr-ui

# yarn を使用する場合
yarn add smarthr-ui

# pnpm を使用する場合
pnpm add smarthr-ui
```

### 依存関係のインストール

peerDependencies として React、React-DOM、styled-components が必要です。

```sh
# npm を使用する場合
npm install react react-dom styled-components

# yarn を使用する場合
yarn add react react-dom styled-components

# pnpm を使用する場合
pnpm add react react-dom styled-components
```

## 基本的な使用方法

最もシンプルで簡単な使用例：

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider, Button } from "smarthr-ui";
import "smarthr-ui/smarthr-ui.css";

const theme = createTheme();

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <Button variant="primary">Hello World</Button>
  </ThemeProvider>
);

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
```

## 利用可能なコンポーネント

SmartHR-UI には多くのコンポーネントが含まれています：

### UI コンポーネント

- Button（AnchorButton, UnstyledButton）
- Input 関連（Select, DropZone など）
- Dialog（FormDialog, MessageDialog, StepFormDialog など）
- Table 関連（Table, SpreadsheetTable など）
- Navigation（TabBar, AppNavi, SideMenu など）
- レイアウト（Header, Pagination, Badge など）

### レイアウトコンポーネント

- Center
- Cluster
- Container
- Reel
- Stack
- Sidebar

### ロゴコンポーネント

- SmartHRLogo
- SmartHRAILogo

### フック

- useTheme
- useDevice（DeviceProvider と組み合わせて使用）

### テーマ関連

- createTheme
- ThemeProvider
- defaultColor, defaultInteraction, defaultBorder など

### 国際化

- IntlProvider
- useIntl
- DateFormatter
- locales

## Storybook での確認

利用可能なコンポーネントの一覧と使用例は、Storybook で確認できます：

https://story.smarthr-ui.dev

## チャートコンポーネント（開発中）

SmartHR-UI には別途チャート専用のパッケージ `smarthr-ui-charts` も開発中です：

```bash
# 公開されたら利用可能になります
npm install smarthr-ui-charts

# 必要な peer dependencies
npm install smarthr-ui react react-dom styled-components
```

## デザインリソース

- SmartHR UI のデザインデータは [Figma](https://www.figma.com/community/file/978607227374353992/SmartHR-UI) で公開されています
- SmartHR のロゴを利用する場合は [SmartHR Design System](https://smarthr.design/) の利用規約を確認してください

## コントリビュート

SmartHR UI は OSS です。コントリビュートは [CONTRIBUTING.md](https://github.com/kufu/smarthr-ui/blob/master/CONTRIBUTING.md) を参照してください。

## 更新履歴

更新履歴は [Releases](https://github.com/kufu/smarthr-ui/releases) で確認できます。

## ライセンス

このプロダクトは [MIT ライセンス](https://github.com/kufu/smarthr-ui/blob/master/LICENSE) の条件に従ってライセンスされています。

## 定数

フォントファミリーやチャートカラーなどの定数も提供されています：

- FONT_FAMILY
- CHART_COLORS
- SINGLE_CHART_COLORS
- OTHER_CHART_COLOR

## セクショニングコンテンツ

HTML5 のセクショニングコンテンツに対応するコンポーネントも提供されています：

- Article
- Aside
- Nav
- Section
