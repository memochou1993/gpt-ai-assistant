# Changelog

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

- Add `ja` to initial languages
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
