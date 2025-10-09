import express from 'express';
import { handleEvents, printPrompts } from '../app/index.js';
import config from '../config/index.js';
import { validateLineSignature } from '../middleware/index.js';
import storage from '../storage/index.js';
import { fetchVersion, getVersion } from '../utils/index.js';
import { isMediaGenerationRequest, mediaRejectMessage } from '../utils/policy.js';
import { matchFAQ } from '../utils/faq.js';

const app = express();

// 保留 raw body 供 LINE 簽章驗證使用
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
}));

// 健康檢查 & 版本資訊
app.get('/', async (req, res) => {
  if (config.APP_URL) {
    res.redirect(config.APP_URL);
    return;
  }
  const currentVersion = getVersion();
  const latestVersion = await fetchVersion();
  res.status(200).send({ status: 'OK', currentVersion, latestVersion });
});

// Webhook 入口
app.post(config.APP_WEBHOOK_PATH, validateLineSignature, async (req, res) => {
  try {
    await storage.initialize();

    // 準備 LINE SDK client（若專案內已有可重用的 client，改為直接取用）
    const { Client } = await import('@line/bot-sdk');
    const client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    });

    const events = Array.isArray(req.body?.events) ? req.body.events : [];
    const remaining = [];

    for (const ev of events) {
      const isText = ev?.type === 'message' && ev?.message?.type === 'text';
      const userText = isText ? (ev.message.text || '') : '';

      // ① 媒體生成請求／非文字訊息：直接拒絕（不進 FAQ/LLM）
      if (isMediaGenerationRequest({ text: userText, event: ev })) {
        try {
          await client.replyMessage(ev.replyToken, {
            type: 'text',
            text: mediaRejectMessage(),
          });
        } catch (e) {
          console.error('[Policy reject reply] failed:', e?.message || e);
        }
        continue;
      }

      // ② FAQ 命中：直接回覆（不進 LLM）
      if (isText) {
        const faqAnswer = matchFAQ(userText);
        if (faqAnswer) {
          try {
            await client.replyMessage(ev.replyToken, { type: 'text', text: faqAnswer });
          } catch (e) {
            console.error('[FAQ reply] failed:', e?.message || e);
            // 回覆失敗就讓事件進入原流程備援
            remaining.push(ev);
          }
          continue;
        }
      }

      // ③ 其他事件 → 走原本流程（OpenAI 等）
      remaining.push(ev);
    }

    if (remaining.length > 0) {
      await handleEvents(remaining);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }

  if (config.APP_DEBUG) printPrompts();
});

// 本地啟動（Vercel 不會用到，但保留相容性）
if (config.APP_PORT) {
  app.listen(config.APP_PORT);
}

export default app;
