# Changelog

## 4.4.4 (2023-03-21)

### Bug Fixes

- Fix default value of `APP_MAX_GROUPS` environment variable
- Fix default value of `APP_MAX_USERS` environment variable

## 4.4.3 (2023-03-11)

### Bug Fixes

- Fix wording of `doc` and `report` commands

## 4.4.2 (2023-03-11)

### Bug Fixes

- Add `ERROR_MESSAGE_DISABLED` environment variable
- Deprecate `ERROR_TIMEOUT_DISABLED` environment variable

## 4.4.1 (2023-03-10)

### Bug Fixes

- Add default max tokens for chat completion api

## 4.4.0 (2023-03-08)

### New Features

- Support snapshots of `gpt-3.5-turbo` model

## 4.3.0 (2023-03-08)

### New Features

- Add `VERCEL_TEAM_ID` environment variable

## 4.2.2 (2023-03-08)

### Bug Fixes

- Optimize error handling

## 4.2.1 (2023-03-07)

### Bug Fixes

- Fix `add-mark` util

## 4.2.0 (2023-03-05)

### New Features

- Add `APP_INIT_PROMPT` environment variable

## 4.1.3 (2023-03-05)

### Bug Fixes

- Fix `add-mark` util

## 4.1.2 (2023-03-05)

### Bug Fixes

- Update `add-mark` util

## 4.1.1 (2023-03-05)

### Bug Fixes

- End text with dot

## 4.1.0 (2023-03-05)

- Support `whisper-1` model
- Add `opencc` text converter
- Store display name and group name to storage

## 4.0.4 (2023-03-03)

### Bug Fixes

- Optimize `search` command

## 4.0.3 (2023-03-03)

### Bug Fixes

- Optimize `search` and `draw` commands

## 4.0.2 (2023-03-02)

### Bug Fixes

- Fix prompt messages

## 4.0.1 (2023-03-02)

### Bug Fixes

- Fix `enquire` command

## 4.0.0 (2023-03-02)

### New Features

- Support `gpt-3.5-turbo` model

### Bug Fixes

- Rename `APP_MAX_PROMPT_SENTENCES` environment variable to `APP_MAX_PROMPT_MESSAGES`

## 3.7.0 (2023-02-26)

### New Features

- Add demo for `search` command
- Add `SERPAPI_LOCATION` environment variable
- Add `SERPAPI_LANG` environment variable

## 3.6.0 (2023-02-26)

### New Features

- Add `APP_API_TIMEOUT` environment variable
- Add `APP_MAX_PROMPT_SENTENCES` environment variable
- Add `APP_MAX_PROMPT_TOKENS` environment variable

## 3.5.0 (2023-02-26)

### New Features

- Rename `HUMAN_BACKGROUND` environment variable to `HUMAN_INIT_PROMPT`
- Rename `BOT_BACKGROUND` environment variable to `BOT_INIT_PROMPT`

## 3.4.1 (2023-02-25)

### Bug Fixes

- Fix default bot name

## 3.4.0 (2023-02-24)

### New Features

- Add `info` endpoint

## 3.3.5 (2023-02-24)

### Bug Fixes

- Fix prompt wording

## 3.3.4 (2023-02-24)

### Bug Fixes

- Fix prompt wording

## 3.3.3 (2023-02-24)

### Bug Fixes

- Fix tests

## 3.3.2 (2023-02-23)

### Bug Fixes

- Fix prompt wording

## 3.3.1 (2023-02-23)

### Bug Fixes

- Fix prompt wording

## 3.3.0 (2023-02-23)

### New Features

- Add `BOT_TONE` environment variable

## 3.2.1 (2023-02-22)

### Bug Fixes

- Fix timeout wording

## 3.2.0 (2023-02-22)

### New Features

- Add `HUMAN_NAME` environment variable
- Add `HUMAN_BACKGROUND` environment variable
- Add `BOT_BACKGROUND` environment variable

## 3.1.0 (2023-02-21)

### New Features

- Implement `forget` command

## 3.0.0 (2023-02-18)

### New Features

- Implement `search` command

## 2.5.1 (2023-02-18)

### New Features

- Rename `BOT_TIMEOUT_DISABLED` environment variable to `ERROR_TIMEOUT_DISABLED`

## 2.5.0 (2023-02-18)

### New Features

- Add `BOT_TIMEOUT_DISABLED` environment variable

## 2.4.0 (2023-02-17)

### New Features

- Add `BOT_DEACTIVATED` environment variable

## 2.3.0 (2023-02-11)

### New Features

- Add `VERCEL_TIMEOUT` environment variable
- Add `OPENAI_TIMEOUT` environment variable
- Add `LINE_TIMEOUT` environment variable

## 2.2.0 (2023-02-04)

### New Features

- Implement `retry` command

## 2.1.4 (2023-01-15)

### Bug Fixes

- Ignore non-text message events

## 2.1.3 (2023-01-15)

### Bug Fixes

- Add command aliases

## 2.1.2 (2023-01-15)

### Bug Fixes

- Add command aliases

## 2.1.1 (2023-01-14)

### Bug Fixes

- Fix `enquire` command

## 2.1.0 (2023-01-11)

### New Features

- Add `VERCEL_PROJECT_NAME` environment variable

## 2.0.1 (2023-01-11)

### Bug Fixes

- Add logs for webhook endpoint

## 2.0.0 (2023-01-10)

### New Features

- Implement `sum` command
- Implement `analyze` command
- Implement `translate` command
- Add `BOT_NAME` environment variable
- Add `APP_MAX_GROUPS` environment variable
- Add `APP_MAX_USERS` environment variable

### Bug Fixes

- Remove `SETTING_AI_NAME` environment variable
- Remove `SETTING_AI_ACTIVATED` environment variable
- Refactor `storage` module
- Refactor `prompt` module
- Refactor `history` module

## 1.12.4 (2022-12-31)

### Bug Fixes

- Rename `chat` command to `talk`

## 1.12.3 (2022-12-31)

### Bug Fixes

- Update command template

## 1.12.2 (2022-12-30)

### Bug Fixes

- Fix summarize request wording

## 1.12.1 (2022-12-30)

### Bug Fixes

- Handle non-text messages

## 1.12.0 (2022-12-30)

### New Features

- Implement `summarize` command

## 1.11.3 (2022-12-29)

### Bug Fixes

- Add command aliases

## 1.11.2 (2022-12-26)

### Bug Fixes

- Handle error messages in every commands

## 1.11.1 (2022-12-26)

### Bug Fixes

- Trim AI Name when sending prompt

## 1.11.0 (2022-12-26)

### New Features

- Implement `call` command
- Add `SETTING_AI_NAME` environment variable
- Add `SETTING_AI_ACTIVATED` environment variable

### Bug Fixes

- Remove `APP_STORAGE` environment variable

## 1.10.2 (2022-12-25)

### Bug Fixes

- Rename methods

## 1.10.1 (2022-12-25)

### Bug Fixes

- Fix wording of commands

## 1.10.0 (2022-12-25)

### New Features

- Add `OPENAI_IMAGE_GENERATION_SIZE` environment variable

### Bug Fixes

- Remove `SETTING_IMAGE_GENERATION_SIZE` setting

## 1.9.1 (2022-12-24)

### Bug Fixes

- Rename functions and variables

## 1.9.0 (2022-12-24)

### New Features

- Implement dynamic configuration
- Implement `configure` command
- Add `SETTING_IMAGE_GENERATION_SIZE` setting

## 1.8.0 (2022-12-24)

### New Features

- Implement `doc` command

### Bug Fixes

- Rename `settings` command to `command`

## 1.7.1 (2022-12-23)

### Bug Fixes

- Fix wording of commands

## 1.7.0 (2022-12-23)

### New Features

- Implement localization
- Implement command aliases

### Bug Fixes

- Rename `OPENAI_COMPLETION_INIT_LANG` environment variable to `APP_LANG`

## 1.6.0 (2022-12-23)

### New Features

- Implement `settings` command

### Bug Fixes

- Rename `chat --auto-reply off` command to `deactivate`
- Rename `chat --auto-reply on` command to `activate`
- Rename `CHAT_AUTO_REPLY` setting to `AI_ACTIVATED`

## 1.5.0 (2022-12-22)

### New Features

- Implement `continue` command with quick reply feature

### Bug Fixes

- Update default max tokens to 160
- Update default max lines to 16

## 1.4.6 (2022-12-20)

### Bug Fixes

- Add comments

## 1.4.5 (2022-12-19)

### Bug Fixes

- Add `ja` initial language
- Add `ai` alias for `chat` command

## 1.4.4 (2022-12-18)

### Bug Fixes

- Rename `AI_AUTO_REPLY` setting to `CHAT_AUTO_REPLY`
- Fix case sensitivity of command issues

## 1.4.3 (2022-12-18)

### Bug Fixes

- Rename `ai` command to `chat`
- Rename `ai --auto-reply off` command to `chat --auto-reply off`
- Rename `ai --auto-reply on` command to `chat --auto-reply on`
- Rename `image` command to `draw`

## 1.4.2 (2022-12-18)

### Bug Fixes

- Refactor commands

## 1.4.1 (2022-12-18)

### Bug Fixes

- Refactor tests

## 1.4.0 (2022-12-18)

### New Features

- Implement `image` command

## 1.3.1 (2022-12-18)

### Bug Fixes

- Rename `VERCEL_WEBHOOK_URL` environment variable to `VERCEL_DEPLOY_HOOK_URL`

## 1.3.0 (2022-12-18)

### New Features

- Implement custom webhook path
- Add `APP_WEBHOOK_PATH` environment variable

## 1.2.1 (2022-12-18)

### Bug Fixes

- Refactor main functions

## 1.2.0 (2022-12-17)

### New Features

- Implement `deploy` command
- Add `VERCEL_WEBHOOK_URL` environment variable

## 1.1.3 (2022-12-17)

### Bug Fixes

- Fix storage module
- Fix `ai --auto-reply off` command
- Fix `ai --auto-reply on` command

## 1.1.2 (2022-12-16)

### Bug Fixes

- Refactor utility functions

## 1.1.1 (2022-12-16)

### Bug Fixes

- Rename `VERCEL_API_KEY` environment variable to `VERCEL_ACCESS_TOKEN`
- Rename `LINE_API_KEY` environment variable to `LINE_CHANNEL_ACCESS_TOKEN`
- Rename `LINE_API_SECRET` environment variable to `LINE_CHANNEL_SECRET`

## 1.1.0 (2022-12-16)

### New Features

- Implement `version` command
- Implement `ai` command
- Implement `ai --auto-reply off` command
- Implement `ai --auto-reply on` command
- Add Vercel API module
- Add `VERCEL_API_KEY` environment variable
- Add `LINE_API_SECRET` environment variable

### Bug Fixes

- Fix timeout issues

## 1.0.0 (2022-12-11)

### New Features

- Implement chat feature
- Add OpenAI API module
- Add LINE API module
