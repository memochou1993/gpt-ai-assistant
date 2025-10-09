// api/index.js
import express from 'express';
import { handleEvents, printPrompts } from '../app/index.js';
import config from '../config/index.js';
import { validateLineSignature } from '../middleware/index.js';
import storage from '../storage/index.js';
import { fetchVersion, getVersion } from '../utils/index.js';
import { isMediaGenerationRequest, mediaRejectMessage } from '../utils/policy.js';
import { matchFAQ } from '../utils/faq.js';

const app = express();

/**
 * 保留原始 Buffer（raw body），提供 LINE 簽章驗證與其他需要原始位元組的流程使用。
 * 千萬不要轉字串，以免某些驗證（或 middleware）出錯。
 */
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf; // keep Buffer
  },
}));

/**
 * 健康檢查 / 版本資訊
 * 若設定 APP_URL，直接導向；否則回傳目前版本與最新版本資訊。
 */
app.get('/', async (_req, res) => {
  if (config.APP_URL) {
    res.redirect(config.APP_URL);
    return;
  }
  const currentVersion = getVersion();
  const latestVersion = await fetchVersion();
  res.status(200).send({ status: 'OK', currentVersion, latestVersion });
});

/**
 * LINE Webhook 入口
 * 流程：
 * 1) 驗章（validateLineSignature）
 * 2) 沒有 events（Verify/健康檢查等）→ 直接 200
 * 3) 媒體生成/非文字 → 直接回覆「暫不提供」
 * 4) 文字訊息先檢 FAQ → 命中則直接回覆
 * 5) 其餘事件 → 交給原本 handleEvents（OpenAI 等）
 */
app.post(config.APP_WEBHOOK_PATH, validateLineSignature, async (req, res) => {
  try {
    // LINE 的 Verify 或某些健康檢查請求可能沒有 events；這種情況直接 200。
    const hasEvents = Array.isArray(req.body?.events) && req.body.events.length > 0;
    if (!hasEvents) {
      return res.sendStatus(200);
    }

    // 初始化（例如載入儲存層、設定等）
    await storage.initialize();

    // 建立 LINE SDK client（若專案內已有共用 client，可改為直接取用）
    const { Client } = await import('@line/bot-sdk');
    const client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    });

    const events = req.body.events;
    const remaining = [];

    for (const ev of events) {
      const isText = ev?.type === 'message' && ev?.message?.type === 'text';
      const userText = isText ? (ev.message.text || '') : '';

      // ① 媒體生成請求或非文字訊息 → 直接拒絕，不進 FAQ/LLM
      if (isMediaGenerationRequest({ text: userText, event: ev })) {
        try {
          await client.replyMessage(ev.replyToken, {
            type: 'text',
            text: mediaRejectMessage(),
          });
        } catch (e) {
          console.error('[Policy reject reply] failed:', e?.stack || e?.message || e);
        }
        continue;
      }

      // ② FAQ 命中 → 直接回覆，不進 LLM
      if (isText) {
        const faqAnswer = matchFAQ(userText);
        if (faqAnswer) {
          try {
            await client.replyMessage(ev.replyToken, { type: 'text', text: faqAnswer });
          } catch (e) {
            console.error('[FAQ reply] failed:', e?.stack || e?.message || e);
            // 回覆失敗就讓事件進入原流程做備援
            remaining.push(ev);
          }
          continue;
        }
      }

      // ③ 其他事件 → 交由原本流程處理（OpenAI 等）
      remaining.push(ev);
    }

    if (remaining.length > 0) {
      await handleEvents(remaining);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('[WEBHOOK ERROR]', err?.stack || err?.message || err);
    res.sendStatus(500);
  }

  if (config.APP_DEBUG) printPrompts();
});

/**
 * 本地啟動（Vercel 不會用到，但保留相容性）
 */
if (config.APP_PORT) {
  app.listen(config.APP_PORT);
}

export default app;
