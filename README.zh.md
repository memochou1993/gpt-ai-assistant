# GPT AI Assistant

<div align="center">

[English](README.md) | 中文

[![license](https://img.shields.io/pypi/l/ansicolortags.svg)](LICENSE) [![Release](https://img.shields.io/github/release/memochou1993/gpt-ai-assistant)](https://GitHub.com/memochou1993/gpt-ai-assistant/releases/)

</div>

## 介紹

GPT AI Assistant 是基於 OpenAI API 與 LINE Messaging API 實作的應用程式，透過安裝步驟，你可以使用 LINE 手機應用程式與你專屬的 AI 助理聊天。

## 範例

<div align="center">
  <img src="demo/screenshot-zh-1.png" width="300"/>
  <img src="demo/screenshot-zh-2.png" width="300"/>
</div>

## 影片教學

- 「[如何創建類似 ChatGPT 的 Line Bot 聊天機器人！](https://www.youtube.com/watch?v=uHsCou1AfEU)」by [程式猿](https://www.youtube.com/watch?v=uHsCou1AfEU)

## 安裝步驟

- 登入 [OpenAI](https://beta.openai.com/) 平台，或註冊一個新的帳號。
  - 生成一個 OpenAI 的 [API key](/demo/openai-api-key.png)。
- 登入 [LINE](https://developers.line.biz/) 平台，或註冊一個新的帳號。
  - 新增一個提供者（Provider），例如「My Provider」。
  - 在「My Provider」新增一個類型為「Messaging API」的頻道（Channel），例如「My AI Assistant」。
  - 進到「My AI Assistant」頻道頁面，點選「Messaging API」頁籤，生成一個頻道的 [channel access token](/demo/line-channel-access-token.png)。
- 登入 [GitHub](https://github.com/) 平台，或註冊一個新的帳號。
  - 進到 `gpt-ai-assistant` 專案頁面。
  - 點選「Star」按鈕，支持這個專案與開發者。
  - 點選「Fork」按鈕，將原始碼複製到自己的儲存庫。
- 登入 [Vercel](https://vercel.com/) 平台，或註冊一個新的帳號。
  - 點選「Create a New Project」按鈕，建立一個新專案。
  - 點選「Import」按鈕，將 `gpt-ai-assistant` 專案匯入。
  - 點選「Environment Variables」頁籤，新增以下環境變數：
    - `OPENAI_API_KEY`：將值設置為 OpenAI 的 [API key](/demo/openai-api-key.png)。
    - `LINE_CHANNEL_ACCESS_TOKEN`：將值設置為 LINE 的 [channel access token](/demo/line-channel-access-token.png)。
    - `LINE_CHANNEL_SECRET`：將值設置為 LINE 的 [channel secret](/demo/line-channel-secret.png)。
    - `APP_LANG`：將值設置為 `zh`。
  - 點選「Deploy」按鈕，等待部署完成。
  - 回到專案首頁，點選「Domains」按鈕，複製應用程式網址，例如「<https://gpt-ai-assistant.vercel.app/>」。
- 回到 [LINE](https://developers.line.biz/) 平台。
  - 進到「My AI Assistant」頻道頁面，點選「Messaging API」頁籤，設置「Webhook URL」，例如「<https://gpt-ai-assistant.vercel.app/webhook>」，點選「Update」按鈕。
  - 點選「Verify」按鈕，驗證是否呼叫成功。
  - 將「Use webhook」功能打開。
  - 將「Auto-reply messages」功能關閉。
  - 將「Greeting messages」功能關閉。
  - 使用 LINE 手機應用程式掃描 QR code，加入好友。
- 開始與你專屬的 AI 助理聊天！

## 程式更新

進到自己的 `gpt-ai-assistant` 專案頁面，點選「Sync fork」選單，再點選「Update branch」或「Discard commit」按鈕，以同步最新的程式碼到自己的儲存庫。

當 Vercel 機器人偵測到程式碼有變更，將會自動重新部署。

<div align="center">
  <img src="demo/github-sync-fork.png" width="300"/>
</div>

## 指令

在 LINE 手機應用程式輸入指令，以執行特定功能。

指令 | 說明
--- | ---
`指令`、`/command` | 取得指令資訊
`版本`、`/version` | 取得版本資訊
`請問`、`/chat`、`/ai` | 與 AI 助理對話
`請畫`、`/draw`、`/image` | 請 AI 助理生成圖像
`繼續`、`/continue` | 請 AI 助理繼續回覆
`開啟自動回覆`、`/activate` | 開啟 AI 自動回覆，須設置 `VERCEL_ACCESS_TOKEN` 環境變數
`關閉自動回覆`、`/deactivate` | 關閉 AI 自動回覆，須設置 `VERCEL_ACCESS_TOKEN` 環境變數
`重新啟動`、`/restart` | 重新部署應用程式，須設置 `VERCEL_DEPLOY_HOOK_URL` 環境變數

## 環境變數

在 Vercel 平台設置環境變數，以變更程式設定。

名稱 | 預設值 | 說明
--- | --- | ---
`APP_DEBUG` | `false` | 決定是否在標準輸出印出訊息，值必須是 `true` 或 `false`。
`APP_WEBHOOK_PATH` | `/webhook` | 決定程式的 webhook URL 路徑。
`APP_LANG` | `zh` | 決定程式的初始語言，值必須是 `zh`、`en` 或 `ja`。
`SETTING_AI_NAME` | `AI` | AI 助理的名字，在關閉自動回覆時用來呼叫。
`SETTING_AI_ACTIVATED` | `null` | AI 助理的狀態，由應用程式控制。
`VERCEL_ACCESS_TOKEN` | `null` | Vercel 的 [access token](/demo/vercel-access-token.png)
`VERCEL_DEPLOY_HOOK_URL` | `null` | Vercel 的 [deploy hook URL](/demo/vercel-deploy-hook-url.png)
`OPENAI_API_KEY` | `null` | OpenAI 的 [API key](/demo/openai-api-key.png)
`OPENAI_COMPLETION_MODEL` | `text-davinci-003` | 詳見 [model](https://beta.openai.com/docs/api-reference/completions/create#completions/create-model) 參數說明。
`OPENAI_COMPLETION_TEMPERATURE` | `0.9` | 詳見 [temperature](https://beta.openai.com/docs/api-reference/completions/create#completions/create-temperature) 參數說明。
`OPENAI_COMPLETION_MAX_TOKENS` | `160` | 詳見 [max_tokens](https://beta.openai.com/docs/api-reference/completions/create#completions/create-max_tokens) 參數說明。
`OPENAI_COMPLETION_FREQUENCY_PENALTY` | `0` | 詳見 [frequency_penalty](https://beta.openai.com/docs/api-reference/completions/create#completions/create-frequency_penalty) 參數說明。
`OPENAI_COMPLETION_PRESENCE_PENALTY` | `0.6` | 詳見 [presence_penalty](https://beta.openai.com/docs/api-reference/completions/create#completions/create-presence_penalty) 參數說明。
`OPENAI_IMAGE_GENERATION_SIZE` | `256x256` | 詳見 [size](https://beta.openai.com/docs/api-reference/images/create#images/create-size) 參數說明。
`LINE_CHANNEL_ACCESS_TOKEN` | `null` | LINE 的 [channel access token](/demo/line-channel-access-token.png)
`LINE_CHANNEL_SECRET` | `null` | LINE 的 [channel secret](/demo/line-channel-secret.png)

點選「Redeploy」按鈕，以重新部署。

## 常見問題

- 遇到「403 Forbidden」的問題，請檢查環境變數是否設置正確。
- 遇到「404 Not Found」的問題，請檢查 webhook URL 是否設置正確。
- 遇到「429 Too Many Requests」的問題，請檢查 OpenAI 的使用額度。

## 除錯

請在 Vercel 平台檢查專案的環境變數是否填寫正確。

<div align="center">
  <img src="demo/vercel-environments.png" width="300"/>
</div>

如果有變更，點選「Redeploy」按鈕，以重新部署。

<div align="center">
  <img src="demo/vercel-redeploy.png" width="300"/>
</div>

或者，在專案首頁點選「View Function Logs」按鈕。

<div align="center">
  <img src="demo/vercel-view-logs.png" width="300"/>
</div>

查看應用程式的錯誤訊息。

<div align="center">
  <img src="demo/vercel-logs.png" width="300"/>
</div>

如果還是無法解決，請到「[Issues](https://github.com/memochou1993/gpt-ai-assistant/issues)」頁面，點選「New issue」按鈕，描述你的問題，並附上螢幕截圖。

## 功能建議

請到「[Issues](https://github.com/memochou1993/gpt-ai-assistant/issues)」頁面，點選「New issue」按鈕，描述你的功能建議。

## 開發

下載專案。

```bash
git clone git@github.com:memochou1993/gpt-ai-assistant.git
```

進到專案目錄。

```bash
cd gpt-ai-assistant
```

安裝依賴套件。

```bash
npm ci
```

### 測試

建立 `.env.test` 檔。

```bash
cp .env.example .env.test
```

在終端機使用以下指令，運行測試。

```bash
npm run test
```

查看結果。

```bash
> gpt-ai-assistant@0.0.0 test
> jest

  console.info
    === 000000 ===
    
    AI: 嗨！我可以怎麼幫助你？
    Human: 嗨？
    AI: OK!

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1 s
```

### 使用代理伺服器

建立 `.env` 檔。

```bash
cp .env.example .env
```

設置環境變數如下：

```env
APP_DEBUG=true
APP_PORT=3000

VERCEL_GIT_REPO_SLUG=gpt-ai-assistant
VERCEL_ACCESS_TOKEN=<your_vercel_access_token>
VERCEL_DEPLOY_HOOK_URL=<your_vercel_deploy_hook_url>

OPENAI_API_KEY=<your_openai_api_key>

LINE_CHANNEL_ACCESS_TOKEN=<your_line_channel_access_token>
LINE_CHANNEL_SECRET=<your_line_channel_secret>
```

在終端機使用以下指令，啟動一個本地伺服器。

```bash
npm run dev
```

在另一個終端機使用以下指令，啟動一個代理伺服器。

```bash
ngrok http 3000
```

回到 [LINE](https://developers.line.biz/) 平台，修改「Webhook URL」，例如「<https://0000-0000-0000.jp.ngrok.io/webhook>」，點選「Update」按鈕。

使用 LINE 手機應用程式發送訊息。

查看結果。

```bash
> gpt-ai-assistant@1.0.0 dev
> node api/index.js

=== 0x1234 ===

AI: 哈囉！
Human: 嗨？
AI: 很高興見到你！有什麼可以為你服務的嗎？
```

## 更新日誌

請到「[Releases](https://github.com/memochou1993/gpt-ai-assistant/releases)」頁面查看發布通知。

## 特別感謝

- [jayer95](https://github.com/jayer95) - Debugging
- [All other contributors](https://github.com/memochou1993/gpt-ai-assistant/graphs/contributors)

## 相關專案

- [line-bot-node](https://github.com/memochou1993/line-bot-node)
- [openai-cli-node](https://github.com/memochou1993/openai-cli-node)

## 授權條款

[MIT](LICENSE)
