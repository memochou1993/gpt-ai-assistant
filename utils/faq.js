// utils/faq.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const faqPath = path.join(__dirname, '..', 'storage', 'faq.json');

// ---- 讀取 FAQ ----
let FAQ_LIST = [];
try {
  const raw = fs.readFileSync(faqPath, 'utf-8');
  const arr = JSON.parse(raw);
  FAQ_LIST = Array.isArray(arr) ? arr : [];
} catch (e) {
  console.warn('[FAQ] Load failed:', e?.message || e);
}

// 可手動重新載入（熱更新）
export function reloadFAQ() {
  try {
    const raw = fs.readFileSync(faqPath, 'utf-8');
    const arr = JSON.parse(raw);
    FAQ_LIST = Array.isArray(arr) ? arr : [];
    return true;
  } catch (e) {
    console.warn('[FAQ] Reload failed:', e?.message || e);
    return false;
  }
}

// ---- 規則：正規化 & 相似度 ----
const STOP_PREFIXES = [
  '請問', '想請問', '你們', '請', '麻煩', '是否', '想詢問', '想了解', '能否', '可以', '可否'
];

export function normalize(s = '') {
  let t = String(s).toLowerCase();

  // 去空白
  t = t.replace(/\s+/g, '');

  // 移除常見全形/半形標點
  t = t.replace(/[＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］］＾＿｀`｛｜｝～《》「」『』【】（）—\-\.,:;!?！？、。·•‧‥…]/g, '');

  // 去掉常見開場語（前綴）
  for (const p of STOP_PREFIXES) {
    const np = p.toLowerCase();
    if (t.startsWith(np)) {
      t = t.slice(np.length);
      break;
    }
  }

  return t.trim();
}

// 字元集合 Jaccard 相似度
function jaccard(a, b) {
  if (!a || !b) return 0;
  const A = new Set(a.split(''));
  const B = new Set(b.split(''));
  let inter = 0;
  for (const ch of A) if (B.has(ch)) inter++;
  const uni = A.size + B.size - inter;
  return uni > 0 ? inter / uni : 0;
}

// 對單一 key 與輸入求分數
function scoreKey(nInput, nKey) {
  if (!nInput || !nKey) return 0;
  if (nInput === nKey) return 1.0;
  if (nInput.includes(nKey) || nKey.includes(nInput)) return 0.98; // 雙向包含
  // 備援：Jaccard（越短字串容錯越要寬）
  return jaccard(nInput, nKey);
}

// ---- 尋找最佳 FAQ ----
// options.minScore：最低通過門檻（預設 0.45）
// 回傳：{ item, score } 或 null
export function findFAQ(input, options = {}) {
  const text = (input ?? '').toString();
  const norm = normalize(text);
  if (!norm) return null;

  const minScore = typeof options.minScore === 'number' ? options.minScore : 0.45;

  let best = null;
  for (const item of FAQ_LIST) {
    const qs = Array.isArray(item?.q) ? item.q : [];
    let localBest = 0;

    for (const q of qs) {
      const s = scoreKey(norm, normalize(q));
      if (s > localBest) localBest = s;
      if (localBest >= 0.98) break; // 早停：雙向包含/幾乎相同
    }

    if (localBest >= minScore) {
      if (!best || localBest > best.score) {
        best = { item, score: localBest };
        if (best.score >= 0.98) break; // 早停：已經非常高
      }
    }
  }

  return best;
}

// ---- 對外提供簡易 API：直接拿答案 ----
export function matchFAQ(input, options = {}) {
  const found = findFAQ(input, options);
  return found?.item?.a || null;
}
