# 簡訊批量發送專案

### 高效管理訊息模板與批量發送簡訊任務的系統。

`摘要`:

- [安裝](#安裝)
- [使用方法](#使用方法)
- [資料庫操作](#資料庫操作)
- [開發](#開發)

## 安裝

1. 確保已安裝 [Node.js](https://nodejs.org/) 和 [pnpm](https://pnpm.io/)。
2. 在專案目錄執行：

   ```shell
   pnpm install
   ```

## 使用方法

### 1. 配置環境變數

在專案根目錄建立 `.env` 檔案，設定以下變數：

- `DATABASE_URL`：資料庫連線字串。
- `SENDER_MODE`：發送訊息模組名稱。
- `NEW_DESCRIPTION`：簡訊內容模板，包含佔位符（例如 `{{coupon}}`），完成對應的腳本會產生對應的 `MessageId`。
- `SEND_TASK_MESSAGE_ID`：`MessageTemplate` 的 ID（整數）。
- `SEND_TASK_LIST_FILENAME`：簡訊任務清單檔案名稱。
- `SEND_JOB_TOPIC_DESCRIBE`：發送簡訊任務的主題。

`.env.example` 為範例檔案，可以複製一份並修改。

```shell
  cp .env.example .env
```

### 2. 確認 `Prisma Client` 生成

進行任務前，需要確認 `Prisma Client` 是否已經生成，參考 [資料庫操作](#資料庫操作) 部分。

### 3. 建立訊息模板

根據環境變數 `NEW_DESCRIPTION`，執行以下指令建立新的簡訊訊息模板：

```shell
  pnpm run create-template
```

### 4. 準備發送任務

目前支援檔案提供發送任務清單，不限制任一副檔名。  
格式為 `mobile,coupon`，不限制換行符，例如：

```csv
  0987654321,優惠碼A
  0912345678,優惠碼B
```

根據環境變數 `SEND_TASK_LIST_FILENAME`，將發送任務清單新增至資料庫：

```shell
  pnpm run prepare-task-list
```

### 4. 發送簡訊

執行發送任務並更新狀態：

```shell
  pnpm run send-sms
```

## 資料庫操作

- 使用 [Prisma](https://www.prisma.io/) 進行資料庫管理。
- 資料庫模型定義於 `prisma/schema.prisma`。
- 配置環境變數 `DATABASE_URL=postgresql://user:password@localhost:5432/database_name`，指定資料庫連線字串。

### 部署資料庫遷移

在生產環境運用，會將資料庫模型部署至資料庫。

```shell
npx prisma migrate deploy
```

### 生成 Prisma Client

此指令會根據 `schema.prisma` 生成 Prisma Client。  
搭配 `部署資料庫遷移` 指令使用。

```shell
  npx prisma generate
```

### 初始化資料模型

開發環境下，執行以下指令初始化資料模型，同時會生成 Prisma Client。

```shell
  npx prisma migrate dev
```

### 重置資料庫

此指令會刪除所有資料庫表格，並重新建立資料模型。

```shell
  npx prisma migrate reset
```

**警告：此操作會刪除所有資料。**

---

## 開發

### 建立本地 `PostgreSQL` 資料庫

1. 安裝 [Docker](https://www.docker.com/)。

2. 移動到專案`.dev-sms-projects`目錄下
   ```shell
   cd .dev-sms-projects
   ```

3. 執行以下指令：
   ```shell
   docker-compose up -d
   ```
