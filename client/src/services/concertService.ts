import { GoogleGenAI } from '@google/genai'
import type { ConcertShow, ConcertFilter } from '../types/concert'

const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string })

// ---------------------------------------------------------------------------
// Gemini + Google Search — 每次呼叫都抓取最新資料
// ---------------------------------------------------------------------------

async function fetchConcertsFromGemini(): Promise<ConcertShow[]> {
  const today = new Date().toISOString().split('T')[0]

  const prompt = `
你是一個韓星演唱會資訊助理。請使用 Google 搜尋查詢 2026 年所有已公告的韓國藝人演唱會最新資訊。

條件：
- 只列出在「韓國、日本、台灣、香港/澳門」舉辦的場次
- 排除演出結束日期早於 ${today} 的場次
- 排除售票已截止的場次
- 包含海外巡演的各地場次（每個城市各列一筆）
- 購票平台請列出當地平台（例如台灣用 KKTIX/拓元，日本用 Lawson Ticket/e+，韓國用 Melon Ticket/Interpark，香港用 HK Ticketing/cityline）

請「只」回傳一個 JSON 陣列，不要加任何說明文字或 markdown 格式，每筆資料格式如下：
[
  {
    "id": "唯一代碼（藝人縮寫-國碼-MMDD，例如 aespa-JP-0509）",
    "artist": "藝人或團體名稱",
    "tourName": "演唱會完整名稱",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "venue": "場地名稱",
    "city": "城市（中文）",
    "country": "KR 或 JP 或 TW 或 HK",
    "ticketSaleStart": "YYYY-MM-DD",
    "ticketSaleEnd": "YYYY-MM-DD 或 null（尚未截止請填 null）",
    "ticketPlatforms": [
      { "name": "平台名稱", "url": "官網網址", "region": "KR 或 JP 或 TW 或 HK" }
    ]
  }
]
`

  const result = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  })

  const rawText = result.text ?? ''

  // 去除 markdown code fence（Gemini 有時會包 ```json ... ```）
  const jsonText = rawText
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/m, '')
    .trim()

  const shows: ConcertShow[] = JSON.parse(jsonText)
  return shows
}

// ---------------------------------------------------------------------------
// Filter & sort（在 client 端二次過濾，確保資料乾淨）
// ---------------------------------------------------------------------------

const TODAY = new Date().toISOString().split('T')[0]

export function getTicketStatus(show: ConcertShow): 'on-sale' | 'upcoming' {
  return show.ticketSaleStart <= TODAY ? 'on-sale' : 'upcoming'
}

function applyFilter(shows: ConcertShow[], filter: ConcertFilter): ConcertShow[] {
  return shows.filter((s) => {
    if (s.endDate < TODAY) return false
    if (s.ticketSaleEnd !== null && s.ticketSaleEnd < TODAY) return false
    if (filter.countries.length && !filter.countries.includes(s.country)) return false
    if (filter.search) {
      const q = filter.search.toLowerCase()
      if (!s.artist.toLowerCase().includes(q) && !s.tourName.toLowerCase().includes(q)) return false
    }
    return true
  })
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** 從 Gemini 抓取並做基本清洗（每次開啟頁面時呼叫一次） */
export async function fetchConcerts(): Promise<ConcertShow[]> {
  const shows = await fetchConcertsFromGemini()
  return shows
    .filter((s) => s.endDate >= TODAY && (s.ticketSaleEnd === null || s.ticketSaleEnd >= TODAY))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

/** 在已抓取的資料上套用篩選條件（不重打 API） */
export function filterConcerts(shows: ConcertShow[], filter: ConcertFilter): ConcertShow[] {
  return applyFilter(shows, filter)
}
