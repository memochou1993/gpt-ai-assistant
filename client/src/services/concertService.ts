import Anthropic from '@anthropic-ai/sdk'
import type { ConcertShow, ConcertFilter } from '../types/concert'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY as string,
  dangerouslyAllowBrowser: true,
})

// ---------------------------------------------------------------------------
// Claude + Web Search — fetch latest concert data on page load
// ---------------------------------------------------------------------------

async function fetchConcertsFromClaude(): Promise<ConcertShow[]> {
  const today = new Date().toISOString().split('T')[0]

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    tools: [
      {
        type: 'web_search_20260209',
        name: 'web_search',
      } as Parameters<typeof client.messages.create>[0]['tools'][0],
    ],
    messages: [
      {
        role: 'user',
        content: `請搜尋 2025–2026 年在韓國、日本、台灣、香港舉辦的韓國藝人演唱會資訊，
包含售票網站（例如 KKTIX、拓元、Melon Ticket、Interpark、Lawson Ticket、e+、HK Ticketing、cityline）。

條件：
- 只列出在「韓國、日本、台灣、香港/澳門」舉辦的場次
- 排除演出結束日期早於 ${today} 的場次
- 排除售票已截止的場次
- 每個城市各列一筆
- 購票平台請列出當地平台的官方網址

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
    "ticketSaleEnd": "YYYY-MM-DD 或 null",
    "ticketPlatforms": [
      { "name": "平台名稱", "url": "官網網址", "region": "KR 或 JP 或 TW 或 HK" }
    ]
  }
]`,
      },
    ],
  })

  // Extract text from the final response content blocks
  const textBlock = response.content.find((block) => block.type === 'text')
  const rawText = textBlock?.type === 'text' ? textBlock.text : ''

  // Strip markdown code fences if present
  const jsonText = rawText
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/m, '')
    .trim()

  const shows: ConcertShow[] = JSON.parse(jsonText)
  return shows
}

// ---------------------------------------------------------------------------
// Filter & sort (client-side, no additional API calls)
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

/** 透過 Claude web search 取得最新演唱會資料（每次開啟頁面呼叫一次） */
export async function fetchConcerts(): Promise<ConcertShow[]> {
  const shows = await fetchConcertsFromClaude()
  return shows
    .filter((s) => s.endDate >= TODAY && (s.ticketSaleEnd === null || s.ticketSaleEnd >= TODAY))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

/** 在已取得的資料上套用篩選條件（不重打 API） */
export function filterConcerts(shows: ConcertShow[], filter: ConcertFilter): ConcertShow[] {
  return applyFilter(shows, filter)
}
