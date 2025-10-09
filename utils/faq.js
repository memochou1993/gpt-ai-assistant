// utils/faq.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const faqPath = path.join(__dirname, '..', 'storage', 'faq.json');

// 在 Vercel Serverless 上讀檔是允許的（唯讀），啟動時載入到記憶體即可
let FAQ_LIST = [];
try {
  FAQ_LIST = JSON.parse(fs.readFileSync(faqPath, 'utf-8'));
} catch (e) {
  console.warn('[FAQ] Load failed:', e.message);
}

// 簡單的「包含」匹配（大小寫與全形空白正規化）
export function matchFAQ(input) {
  if (!input) return null;
  const norm = normalize(input);
  for (const item of FAQ_LIST) {
    if (!item?.q || !item?.a) continue;
    if (item.q.some(k => norm.includes(normalize(k)))) {
      return item.a;
    }
  }
  return null;
}

function normalize(s) {
  return String(s)
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～]/g, '')
    .trim();
}
