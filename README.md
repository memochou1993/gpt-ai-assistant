# GPT AI Assistant

<div align="center">

English | [中文](README.zh.md)

[![license](https://img.shields.io/pypi/l/ansicolortags.svg)](LICENSE) [![Release](https://img.shields.io/github/release/memochou1993/gpt-ai-assistant)](https://GitHub.com/memochou1993/gpt-ai-assistant/releases/)

</div>

## About

GPT AI Assistant is a lightweight and extensible application that is implemented using the OpenAI API and LINE Messaging API.

Through the installation process, you can start to chat with your own AI assistant using the LINE mobile app.

## Demo

<div align="center">
  <img src="demo/screenshot-en-1.png" width="300"/>
  <img src="demo/screenshot-en-2.png" width="300"/>
</div>

## Installation

- Log in to the [OpenAI](https://beta.openai.com/) website.
  - Generate an OpenAI [API key](/demo/openai-api-key.png).
- Log in to the [LINE](https://developers.line.biz/) website.
  - Add a provider (e.g. "My Provider").
  - Create a channel (e.g. "My AI Assistant") of type Messaging API.
  - Click the "Messaging API" tab and generate a [channel access token](/demo/line-channel-access-token.png).
- Log in to the [GitHub](https://github.com/) website.
  - Go to the `gpt-ai-assistant` project.
  - Click the "Star" button to support this project and the developer.
  - Click the "Fork" button to copy the source code to your own repository.
- Log in to the [Vercel](https://vercel.com/) website.
  - Click the "Create a New Project" button to create a new project.
  - Click the "Import" button to import the `gpt-ai-assistant` project.
  - Click the "Environment Variables" tab and add the following environment variables with their corresponding values:
    - `OPENAI_API_KEY` with the OpenAI [API key](/demo/openai-api-key.png).
    - `LINE_CHANNEL_ACCESS_TOKEN` with the LINE [channel access token](/demo/line-channel-access-token.png).
    - `LINE_CHANNEL_SECRET` with the LINE [channel secret](/demo/line-channel-secret.png).
    - `APP_LANG` with `en`.
  - Click the "Deploy" button and wait for the deployment to complete.
  - Go to the dashboard, click the "Domains" button and copy the application URL, e.g. "<https://gpt-ai-assistant.vercel.app/>".
- Go back to the [LINE](https://developers.line.biz/) website.
  - Go to the page of "My AI Assistant", click the "Messaging API" tab, set the "Webhook URL", e.g. "<https://gpt-ai-assistant.vercel.app/webhook>" and click the "Update" button.
  - Click the "Verify" button to verify the webhook call is successful.
  - Enable the "Use webhook" feature.
  - Disable the "Auto-reply messages" feature.
  - Disable the "Greeting messages" feature.
  - Scan the QR code using the LINE mobile app to add as a friend.
- Start chatting with your own AI assistant!

## Upgrade

On your own `gpt-ai-assistant` project page, you can click on the "Sync fork" menu and then click on either the "Update branch" or "Discard commit" button to synchronize the latest code to your repository.

When the Vercel bot detects a change in the code, it will automatically redeploy.

<div align="center">
  <img src="demo/github-sync-fork.png" width="300"/>
</div>

## Commands

Send commands using the LINE mobile app to perform specific functions.

Name | Description
--- | ---
`Command`, `/command` | Show the application commands.
`Version`, `/version` | Show the application version.
`Chat`, `AI`, `/ai` | Start a conversation with AI Assistant.
`Continue`, `/continue` | Ask AI Assistant to continue the conversation.
`Draw`, `/draw` | Ask AI Assistant to draw a picture.
`Activate`, `/activate` | Activate auto-reply. The `VERCEL_ACCESS_TOKEN` environment variable is required.
`Deactivate`, `/deactivate` | Deactivate auto-reply. The `VERCEL_ACCESS_TOKEN` environment variable is required.
`Restart`, `/restart` | Deploy the application. The `VERCEL_DEPLOY_HOOK_URL` environment variable is required.

## Environment Variables

Set environment variables to change program settings.

Name | Default Value | Description
--- | --- | ---
`APP_DEBUG` | `false` | Print prompt to console. The value must be `true` of `false`.
`APP_WEBHOOK_PATH` | `/webhook` | Custom webhook URL path of application
`APP_LANG` | `zh` | Application language. The value must be one of `zh`, `en` or `ja`.
`VERCEL_ACCESS_TOKEN` | `null` | Vercel [access token](/demo/vercel-access-token.png)
`VERCEL_DEPLOY_HOOK_URL` | `null` | Vercel [deploy hook URL](/demo/vercel-deploy-hook-url.png)
`OPENAI_API_KEY` | `null` | OpenAI [API key](/demo/openai-api-key.png)
`OPENAI_COMPLETION_MODEL` | `text-davinci-003` | Refer to [model](https://beta.openai.com/docs/api-reference/completions/create#completions/create-model) parameter for details.
`OPENAI_COMPLETION_TEMPERATURE` | `0.9` | Refer to [temperature](https://beta.openai.com/docs/api-reference/completions/create#completions/create-temperature) parameter for details.
`OPENAI_COMPLETION_MAX_TOKENS` | `160` | Refer to [max_tokens](https://beta.openai.com/docs/api-reference/completions/create#completions/create-max_tokens) parameter for details.
`OPENAI_COMPLETION_FREQUENCY_PENALTY` | `0` | Refer to [frequency_penalty](https://beta.openai.com/docs/api-reference/completions/create#completions/create-frequency_penalty) parameter for details.
`OPENAI_COMPLETION_PRESENCE_PENALTY` | `0.6` | Refer to [presence_penalty](https://beta.openai.com/docs/api-reference/completions/create#completions/create-presence_penalty) parameter for details.
`OPENAI_IMAGE_GENERATION_SIZE` | `256x256` | Refer to [size](https://beta.openai.com/docs/api-reference/images/create#images/create-size) parameter for details.
`LINE_CHANNEL_ACCESS_TOKEN` | `null` | LINE [channel access token](/demo/line-channel-access-token.png)
`LINE_CHANNEL_SECRET` | `null` | LINE [channel secret](/demo/line-channel-secret.png)

Click the "Redeploy" button to redeploy if there are any changes.

## Debug

1. Check if the environment variables of the project are filled out correctly in the Vercel.
2. Click the "Redeploy" button to redeploy if there are any changes.
3. If there is still a problem, please go to [Issues](https://github.com/memochou1993/gpt-ai-assistant/issues) page, describe your problem and attach a screenshot.

## Development

Clone the project.

```bash
git clone git@github.com:memochou1993/gpt-ai-assistant.git
```

Go to the project directory.

```bash
cd gpt-ai-assistant
```

Install dependencies.

```bash
npm ci
```

### Tests

Copy `.env.example` to `.env.test`.

```bash
cp .env.example .env.test
```

Run the tests.

```bash
npm run test
```

Check the results.

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

### Using Proxy Server

Copy `.env.example` to `.env`.

```bash
cp .env.example .env
```

Set the environment variables as follows:

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

Start a local server.

```bash
npm run dev
```

Start a proxy server.

```bash
ngrok http 3000
```

Go back to the [LINE](https://developers.line.biz/) website, modify the "Webhook URL" to e.g. "<https://0000-0000-0000.jp.ngrok.io/webhook>" and click the "Update" button.

Send a message from the LINE mobile app.

Check the results.

```bash
> gpt-ai-assistant@1.0.0 dev
> node api/index.js

=== 0x1234 ===

AI: 哈囉！
Human: 嗨？
AI: 很高興見到你！有什麼可以為你服務的嗎？
```

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/memochou1993/gpt-ai-assistant/releases).

## Related Projects

- [line-bot-node](https://github.com/memochou1993/line-bot-node)
- [openai-cli-node](https://github.com/memochou1993/openai-cli-node)

## Contributors

<a href="https://github.com/memochou1993/gpt-ai-assistant/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=memochou1993/gpt-ai-assistant" />
</a>

## License

[MIT](LICENSE)
