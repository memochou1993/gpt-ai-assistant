// utils/policy.js
// 簡單關鍵字/型別偵測：圖片 / 影片 / 音檔 產生類需求一律阻擋
export function isMediaGenerationRequest({ text = "", event = null } = {}) {
  const t = (text || "").toLowerCase().trim();

  // 1) 常見 slash 指令（支援多語與常見別名）
  const slashCmds = [
    '/image', '/img', '/imagine', '/draw', '/paint', '/picture',
    '/video', '/vid', '/movie', '/animate',
    '/audio', '/voice', '/music', '/song', '/tts',
    '/圖片', '/畫圖', '/繪圖', '/產生圖片', '/生成圖片', '/影像', '/照片',
    '/影片', '/生成影片', '/產生影片', '/動圖',
    '/音檔', '/語音', '/音樂', '/產生音檔', '/生成音檔', '/tts'
  ];
  if (slashCmds.some(cmd => t.startsWith(cmd))) return true;

  // 2) 關鍵字（中文/英文）
  const keywords = [
    // 圖片
    '生成圖片','產生圖片','畫一張','幫我畫','出圖','出圖片','畫圖','繪圖','圖片生成','image','picture','photo','draw','paint','imagine',
    // 影片
    '生成影片','產生影片','做影片','影片生成','video','movie','clip','animate','動畫',
    // 音檔 / 語音 / 音樂
    '生成音檔','產生音檔','語音合成','tts','text to speech','audio','voice','music','song','配樂','音樂生成'
  ];
  if (keywords.some(k => t.includes(k))) return true;

  // 3) LINE 非文字訊息類型（若使用者上傳或要求處理也直接回覆不提供）
  if (event) {
    const mt = event?.message?.type;
    const nonTextTypes = new Set(['image','video','audio','file','sticker','location']);
    if (nonTextTypes.has(mt)) return true;
  }

  return false;
}

// 可自訂拒絕訊息（支援環境變數覆蓋）
export function mediaRejectMessage() {
  return process.env.APP_MEDIA_REJECT_MSG
    || '目前暫不提供圖片、影片、音檔生成功能。';
}
