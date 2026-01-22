# 日本住所検索アプリ

## 概要

本プロジェクトは、**Cocone のエンジニアリング課題**として作成されたものです。  
郵便番号をもとに **日本の住所を検索できる Web アプリケーション**を実装しています。

このリポジトリには、プロジェクトのセットアップおよび実行に必要なすべてのファイルとドキュメントが含まれています。

## フォルダ構成

| フォルダ名 | 説明 |
|----------|------|
| 📁 assets | LESS、SASS、画像などの未加工アセット |
| 📁 components | 再利用可能な Vue コンポーネント |
| 📁 composables | 再利用可能なリアクティブロジック |
| 📁 coverage | テストカバレッジのレポート |
| 📁 layouts | ページ全体のレイアウト定義 |
| 📁 pages | アプリケーションのルーティングに対応する Vue ファイル |
| 📁 plugins | アプリ初期化用のプラグイン |
| 📁 public | ルートパスから参照可能な静的ファイル |
| 📁 server | サーバーサイドコードおよび API |
| 📁 stores | アプリケーションの状態管理 |
| 📁 test | すべてのテストコード |
| 📁 utils | ユーティリティ関数および共通ヘルパー |

## 使用技術・ライブラリ

| 🚀 | バージョン |
|----|-----------|
| Node | 24.13.0 |
| pnpm | 10.28.1 |
| Nuxt | ^4.2.2 |
| Vue | ^3.5.27 |

## インストール方法

Node.js 24 が必要です。  
https://nodejs.org/en/download

```bash
corepack enable pnpm
pnpm install
```

## プロジェクトの起動方法

### 開発環境

```bash
pnpm run dev [--host]
```

### 本番ビルド

```bash
pnpm run build
pnpm run preview
```

## Docker

まずはイメージをビルドしてください。
```bash
docker build -t address-search .
docker run -p 3000:3000 address-search
```
ウェブサイトは　[こちら](http://localhost:3000)になります。

## テスト

```bash
pnpm test
pnpm run test:unit
pnpm run test:nuxt
```
最新コマンドは全部をテストします。`test:unit`はユニットテストを実行し、`test:nuxt`はコンポーネントテストを実行する。

## カバレッジ

```bash
pnpm run test:coverage
```

テスト範囲は`coverage/index.html`を開く、結果を確認します。

## AI 利用について

CSS 関連の補助、テストベース生成、一部デバッグに AI を使用しました。  
プロジェクト構成・実装はすべて自作です。
