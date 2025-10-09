// api/index.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { handleEvents, printPrompts } from '../app/index.js';
import config from '../config/index.js';
import { validateLineSignature } from '../middleware/index.js';
import storage from '../storage/index.js';
import { fetchVersion, getVersion } from '../utils/index.js';
import { isMediaGenerationRequest, mediaRejectMessage } from '../utils/policy.js';
import { matchFAQ, findFAQ, reloadFAQ } from '../utils/faq.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const faqFilePath = path.join(__dirname, '..', 'storage', 'faq.json');

const app = express();

/**
 * 保留原始 Buffer（raw body），供簽章驗證與中介層需要原始位元組時使用。
 * 請勿轉字串，以免破壞驗章或其他流程。
 */
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf; // keep Buffer
  },
}));

/**
 * 健康檢查 / 版本資訊
 * 若設定 APP_URL，直接導向；否則回目前與最新版本號。
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
 * 診斷路由（調試用）：
 * - 確認 FAQ 模組可用與是否能重新載入
 * - 檢查 FAQ 檔案存在與筆數
 * 完成調試後可移除本路由。
 */
app.get('/_diag', (_req, res) => {
  let fileExists = false;
  let fileSize = null;
  try {
    fileExists = fs.existsSync(faqFilePath);
    if (fileExists) {
      const raw = fs.readFileSync(faqFilePath, 'utf-8');
      const arr = JSON.parse(raw);
      fileSize = Array.isArray(arr) ? arr.length : null;
    }
  } catch (e) {
    // ignore
  }

  let reloaded = false;
  try {
    reloaded = !!reloadFAQ();
  } catch {
    reloaded = false;
  }

  res.status(200).send({
    faqModule: 'ok',
    reloaded,
    faqFileExists: fileExists,
    faqFileSize: fileSize,
  });
});

/**
 * LINE Webhook 入口
 * 流程：
 * 1) 驗章（validateLineSignature）
 * 2) 沒有 events（Verify/健康檢查等）→ 直接 200
 * 3) 媒體生成/非文字 → 直接回覆「暫不提供」
 * 4) 文字訊息先檢 FAQ → 命中則直接回覆（含 try/catch）
 * 5) 其餘事件 → 交給原本 handleEvents（OpenAI 等）
 * 6) 關鍵節點印診斷 log，便於在 Vercel Functions 觀察
 */
app.post(config.APP_WEBHOOK_PATH, validateLineSignature, async (req, res) => {
  try {
    // Verify 或無事件的情況，不做額外流程，直接 200
    const hasEvents = Array.isArray(req.body?.events) && req.body.events.length > 0;
    if (!hasEvents) {
      return res.sendStatus(200);
    }

    // 初始化儲存層
    await storage.initialize();

    // 準備 LINE SDK client
    const { Client } = await import('@line/bot-sdk');
    const client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    });

    const events = req.body.events;
    const remaining = [];

    for (const ev of events) {
      const isText = ev?.type === 'message' && ev?.message?.type === 'text';
      const userText = isText ? (ev.message.text || '') : '';

      console.log('[WH EVENT]', {
        type: ev?.type,
        msgType: ev?.message?.type,
        text: userText,
      });

      // ① 政策：媒體生成請求或非文字訊息 → 直接拒絕
      if (isMediaGenerationRequest({ text: userText, event: ev })) {
        console.log('[POLICY] blocked media generation');
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

      // ② FAQ：先嘗試命中（雙向包含 + 相似度）
      if (isText) {
        const hit = findFAQ(userText); // { item, score } 或 null
        console.log('[FAQ CHECK]', { hit: !!hit, score: hit?.score ?? null });

        const faqAnswer = hit?.item?.a || matchFAQ(userText);
        if (faqAnswer) {
          try {
            await client.replyMessage(ev.replyToken, { type: 'text', text: faqAnswer });
            console.log('[FAQ REPLIED]');
          } catch (e) {
            console.error('[FAQ reply] failed:', e?.stack || e?.message || e);
            // 回覆失敗 → 放回 remaining 由原流程備援處理
            remaining.push(ev);
          }
          continue;
        }
      }

      // ③ 其他事件 → 進入原本流程（OpenAI 等）
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
