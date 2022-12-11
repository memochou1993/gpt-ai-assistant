# AI Assistant

AI Assistant 是基於 OpenAI API 與 LINE Messaging API 實作的範例應用程式，透過安裝步驟，你可以使用 LINE 手機應用程式與你專屬的 AI 助理聊天。

## 範例

<p align="center">
  <img src="demo/screenshot-1.png" width="300"/>
  <img src="demo/screenshot-2.png" width="300"/>
</p>

## 安裝步驟

- 登入 [OpenAI](https://beta.openai.com/) 平台，或註冊一個新的帳號。
  - 生成一個 OpenAI 的 [API 金鑰](/demo/openai-api-key.png)（API key）。
- 登入 [LINE](https://developers.line.biz/) 平台，或註冊一個新的帳號。
  - 新增一個提供者（Provider），例如「My Provider」。
  - 在「My Provider」新增一個類型為「Messaging API」的頻道（Channel），例如「My AI Assistant」。
  - 在「My AI Assistant」點選「Messaging API」頁籤，生成一個頻道的 [API 金鑰](/demo/line-api-key.png)（Channel access token）。
- 登入 [GitHub](https://github.com/) 平台，或註冊一個新的帳號。
  - 進到 `ai-assistant` 專案頁面，點選「Fork」按鈕，將原始碼複製到自己的儲存庫。
- 登入 [Vercel](https://vercel.com/) 平台，或註冊一個新的帳號。
  - 點選「Create a New Project」按鈕，建立一個新專案。
  - 點選「Import」按鈕，將 `ai-assistant` 專案匯入。
  - 點選「Environment Variables」頁籤，新增以下環境變數：
    - `OPENAI_API_KEY`：將值設置為 OpenAI 的 API 金鑰。
    - `LINE_API_KEY`：將值設置為 LINE 的 API 金鑰。
  - 點選「Deploy」按鈕，等待部署完成。
  - 點選「Domains」按鈕，複製應用程式網址，例如「<https://my-ai-assistant.vercel.app/>」。
- 回到 [LINE](https://developers.line.biz/) 平台。
  - 進到「My AI Assistant」頻道頁面，點選「Messaging API」頁籤，設置「Webhook URL」，例如「<https://my-ai-assistant.vercel.app/webhook>」，點選「Update」按鈕。
  - 點選「Verify」按鈕，驗證是否呼叫成功。
  - 將「Use webhook」功能打開。
  - 將「Auto-reply messages」功能關閉。
  - 將「Greeting messages」功能關閉。
  - 使用 LINE 手機應用程式掃描 QR code，加入好友。
- 開始與你專屬的 AI 助理聊天！

## 進階設定

在 Vercel 平台上新增環境變數，以開啟更多功能。

Key | Value
--- | ---
`APP_DEBUG` | 設置 `true` 決定印出訊息
`OPENAI_COMPLETION_LANG` | 設置 `en` 決定初始語言為英文

點選「Redeploy」按鈕，以重新部署。

![vercel-redeploy](/demo/vercel-redeploy.png)

## 更新程式

點選「Sync fork」選單，再點選「Update branch」按鈕，以同步最新的程式碼到自己的儲存庫。

![github-sync-fork](/demo/github-sync-fork.png)

## 除錯

首先在 Vercel 平台上檢查專案的環境變數是否填寫正確。

![vercel-environments](/demo/vercel-environments.png)

如果有進行變更，點選「Redeploy」按鈕，以重新部署。

![vercel-redeploy](/demo/vercel-redeploy.png)

進一步的除錯方式是，點選「View Function Logs」按鈕，以查看應用程式的錯誤訊息。

![vercel-redeploy](/demo/vercel-view-logs.png)

## 開發

下載專案。

```bash
git@github.com:memochou1993/ai-assistant.git
```

進到專案目錄。

```bash
cd ai-assistant
```

安裝依賴套件。

```bash
npm ci
```

建立 `.env` 檔。

```bash
cp .env.example .env
```

設置相關環境變數。

```env
APP_ENV=local
APP_DEBUG=true
APP_PORT=3000
OPENAI_API_KEY=<your_openai_api_key>
LINE_API_KEY=<empty_string>
```

### 測試

執行以下指令，執行測試，並且向 OpenAI 伺服器發送請求。

```bash
npm run test
```

查看結果。

```bash
> openai-line-bot@1.0.0 test
> jest

  console.info
    === 00000 ===
    
    AI: 嗨！我可以怎麼幫助你？
    Human: 嗨？
    AI: 你好！有什麼可以幫助你的嗎？

      at Assistant.info [as debug] (assistant/assistant.js:55:28)

 PASS  assistant/index.test.js
  ✓ assistant works (1689 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.579 s, estimated 4 s
Ran all test suites.
```

### 模擬請求

執行以下指令，啟動一個 Local 伺服器。

```bash
npm run dev
```

再執行以下指令，模擬 LINE 伺服器向 Local 伺服器發送請求，再由 Local 伺服器向 OpenAI 伺服器發送請求。

```bash
curl --request POST \
  --url http://localhost:3000/webhook \
  --header 'Content-Type: application/json' \
  --data '{
    "events": [
      {
        "type": "message",
        "source": {
          "type": "user",
          "userId": "00000"
        },
        "message": {
            "type": "text",
            "text": "我是誰"
          }
        }
      ]
    }'
```

查看結果。

```bash
> openai-line-bot@1.0.0 dev
> node api/index.js

=== 00000 ===

AI: 嗨！我可以怎麼幫助你？
Human: 我是誰？
AI: 你是一個人，一個有意識的生物！
```

## 相關專案

- [line-bot-node](https://github.com/memochou1993/line-bot-node)
- [openai-cli-node](https://github.com/memochou1993/openai-cli-node)

## 貢獻者

<a href="https://github.com/memochou1993/nyan-profile/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=memochou1993/nyan-profile" width="50" />
</a>
