import type { ConcertShow, ConcertFilter } from '../types/concert'

// ---------------------------------------------------------------------------
// Mock Data — 2026 年已公告韓星演唱會（含海外場）
// 僅收錄：韓國 / 日本 / 台灣 / 港澳
// ---------------------------------------------------------------------------

const ALL_SHOWS: ConcertShow[] = [
  // ── aespa ────────────────────────────────────────────────────────────────
  {
    id: 'aespa-JP-0509',
    artist: 'aespa',
    tourName: "aespa WORLD TOUR 'SYNK : PARALLEL LINE'",
    startDate: '2026-05-09',
    endDate: '2026-05-10',
    venue: '国立代々木競技場 第一体育館',
    city: '東京',
    country: 'JP',
    ticketSaleStart: '2026-03-01',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Lawson Ticket', url: 'https://l-tike.com', region: 'JP' },
      { name: 'e+', url: 'https://eplus.jp', region: 'JP' },
    ],
  },
  {
    id: 'aespa-KR-0530',
    artist: 'aespa',
    tourName: "aespa WORLD TOUR 'SYNK : PARALLEL LINE'",
    startDate: '2026-05-30',
    endDate: '2026-05-31',
    venue: 'KSPO Dome (올림픽체조경기장)',
    city: '首爾',
    country: 'KR',
    ticketSaleStart: '2026-03-15',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'YES24 Live', url: 'https://ticket.yes24.com', region: 'KR' },
      { name: 'Interpark', url: 'https://ticket.interpark.com', region: 'KR' },
    ],
  },
  {
    id: 'aespa-TW-0627',
    artist: 'aespa',
    tourName: "aespa WORLD TOUR 'SYNK : PARALLEL LINE'",
    startDate: '2026-06-27',
    endDate: '2026-06-28',
    venue: '台北小巨蛋',
    city: '台北',
    country: 'TW',
    ticketSaleStart: '2026-04-20',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'KKTIX', url: 'https://kktix.com', region: 'TW' },
    ],
  },

  // ── LE SSERAFIM ──────────────────────────────────────────────────────────
  {
    id: 'lesserafim-KR-0509',
    artist: 'LE SSERAFIM',
    tourName: "LE SSERAFIM TOUR 2026 'CRAZY'",
    startDate: '2026-05-09',
    endDate: '2026-05-10',
    venue: 'KSPO Dome (올림픽체조경기장)',
    city: '首爾',
    country: 'KR',
    ticketSaleStart: '2026-03-08',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Interpark', url: 'https://ticket.interpark.com', region: 'KR' },
      { name: 'Melon Ticket', url: 'https://ticket.melon.com', region: 'KR' },
    ],
  },
  {
    id: 'lesserafim-JP-0613',
    artist: 'LE SSERAFIM',
    tourName: "LE SSERAFIM TOUR 2026 'CRAZY'",
    startDate: '2026-06-13',
    endDate: '2026-06-14',
    venue: '国立競技場',
    city: '東京',
    country: 'JP',
    ticketSaleStart: '2026-04-10',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Lawson Ticket', url: 'https://l-tike.com', region: 'JP' },
      { name: 'TicketPia', url: 'https://t.pia.jp', region: 'JP' },
    ],
  },
  {
    id: 'lesserafim-HK-0627',
    artist: 'LE SSERAFIM',
    tourName: "LE SSERAFIM TOUR 2026 'CRAZY'",
    startDate: '2026-06-27',
    endDate: '2026-06-27',
    venue: 'Asia World-Expo',
    city: '香港',
    country: 'HK',
    ticketSaleStart: '2026-04-25',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'cityline', url: 'https://www.cityline.com', region: 'HK' },
      { name: 'HK Ticketing', url: 'https://www.hkticketing.com', region: 'HK' },
    ],
  },
  {
    id: 'lesserafim-TW-0718',
    artist: 'LE SSERAFIM',
    tourName: "LE SSERAFIM TOUR 2026 'CRAZY'",
    startDate: '2026-07-18',
    endDate: '2026-07-19',
    venue: '台北小巨蛋',
    city: '台北',
    country: 'TW',
    ticketSaleStart: '2026-05-17',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'KKTIX', url: 'https://kktix.com', region: 'TW' },
      { name: '拓元售票', url: 'https://www.tixcraft.com', region: 'TW' },
    ],
  },

  // ── TWICE ────────────────────────────────────────────────────────────────
  {
    id: 'twice-JP-0515',
    artist: 'TWICE',
    tourName: "TWICE WORLD TOUR 2026 'WITH YOU-TH'",
    startDate: '2026-05-15',
    endDate: '2026-05-17',
    venue: '国立代々木競技場 第一体育館',
    city: '東京',
    country: 'JP',
    ticketSaleStart: '2026-03-20',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'e+', url: 'https://eplus.jp', region: 'JP' },
      { name: 'Lawson Ticket', url: 'https://l-tike.com', region: 'JP' },
    ],
  },
  {
    id: 'twice-KR-0613',
    artist: 'TWICE',
    tourName: "TWICE WORLD TOUR 2026 'WITH YOU-TH'",
    startDate: '2026-06-13',
    endDate: '2026-06-14',
    venue: 'KSPO Dome (올림픽체조경기장)',
    city: '首爾',
    country: 'KR',
    ticketSaleStart: '2026-04-01',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Ticketlink', url: 'https://www.ticketlink.co.kr', region: 'KR' },
      { name: 'Melon Ticket', url: 'https://ticket.melon.com', region: 'KR' },
    ],
  },
  {
    id: 'twice-TW-0808',
    artist: 'TWICE',
    tourName: "TWICE WORLD TOUR 2026 'WITH YOU-TH'",
    startDate: '2026-08-08',
    endDate: '2026-08-09',
    venue: '台北小巨蛋',
    city: '台北',
    country: 'TW',
    ticketSaleStart: '2026-06-07',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'KKTIX', url: 'https://kktix.com', region: 'TW' },
      { name: '年代售票', url: 'https://ticket.era.com.tw', region: 'TW' },
    ],
  },

  // ── IVE ──────────────────────────────────────────────────────────────────
  {
    id: 'ive-KR-0516',
    artist: 'IVE',
    tourName: "IVE THE 1ST WORLD TOUR 'SHOW WHAT I HAVE'",
    startDate: '2026-05-16',
    endDate: '2026-05-17',
    venue: 'KSPO Dome (올림픽체조경기장)',
    city: '首爾',
    country: 'KR',
    ticketSaleStart: '2026-03-22',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Interpark', url: 'https://ticket.interpark.com', region: 'KR' },
      { name: 'YES24 Live', url: 'https://ticket.yes24.com', region: 'KR' },
    ],
  },
  {
    id: 'ive-JP-0620',
    artist: 'IVE',
    tourName: "IVE THE 1ST WORLD TOUR 'SHOW WHAT I HAVE'",
    startDate: '2026-06-20',
    endDate: '2026-06-21',
    venue: '京セラドーム大阪',
    city: '大阪',
    country: 'JP',
    ticketSaleStart: '2026-04-18',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'e+', url: 'https://eplus.jp', region: 'JP' },
      { name: 'TicketPia', url: 'https://t.pia.jp', region: 'JP' },
    ],
  },
  {
    id: 'ive-TW-0711',
    artist: 'IVE',
    tourName: "IVE THE 1ST WORLD TOUR 'SHOW WHAT I HAVE'",
    startDate: '2026-07-11',
    endDate: '2026-07-12',
    venue: '台北小巨蛋',
    city: '台北',
    country: 'TW',
    ticketSaleStart: '2026-05-10',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'KKTIX', url: 'https://kktix.com', region: 'TW' },
      { name: '拓元售票', url: 'https://www.tixcraft.com', region: 'TW' },
    ],
  },
  {
    id: 'ive-HK-0725',
    artist: 'IVE',
    tourName: "IVE THE 1ST WORLD TOUR 'SHOW WHAT I HAVE'",
    startDate: '2026-07-25',
    endDate: '2026-07-26',
    venue: 'Asia World-Expo',
    city: '香港',
    country: 'HK',
    ticketSaleStart: '2026-05-24',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'HK Ticketing', url: 'https://www.hkticketing.com', region: 'HK' },
      { name: 'POPTICKET', url: 'https://www.popticket.hk', region: 'HK' },
    ],
  },

  // ── SEVENTEEN ─────────────────────────────────────────────────────────────
  {
    id: 'svt-KR-0523',
    artist: 'SEVENTEEN',
    tourName: "SEVENTEEN TOUR 'FOLLOW' TO ASIA 2026",
    startDate: '2026-05-23',
    endDate: '2026-05-24',
    venue: 'KSPO Dome (올림픽체조경기장)',
    city: '首爾',
    country: 'KR',
    ticketSaleStart: '2026-03-29',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Melon Ticket', url: 'https://ticket.melon.com', region: 'KR' },
      { name: 'Interpark', url: 'https://ticket.interpark.com', region: 'KR' },
    ],
  },
  {
    id: 'svt-TW-0614',
    artist: 'SEVENTEEN',
    tourName: "SEVENTEEN TOUR 'FOLLOW' TO ASIA 2026",
    startDate: '2026-06-14',
    endDate: '2026-06-15',
    venue: '台北小巨蛋',
    city: '台北',
    country: 'TW',
    ticketSaleStart: '2026-04-13',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'KKTIX', url: 'https://kktix.com', region: 'TW' },
    ],
  },
  {
    id: 'svt-JP-0704',
    artist: 'SEVENTEEN',
    tourName: "SEVENTEEN TOUR 'FOLLOW' TO ASIA 2026",
    startDate: '2026-07-04',
    endDate: '2026-07-05',
    venue: '東京ドーム',
    city: '東京',
    country: 'JP',
    ticketSaleStart: '2026-05-03',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Lawson Ticket', url: 'https://l-tike.com', region: 'JP' },
      { name: 'e+', url: 'https://eplus.jp', region: 'JP' },
    ],
  },
  {
    id: 'svt-HK-0719',
    artist: 'SEVENTEEN',
    tourName: "SEVENTEEN TOUR 'FOLLOW' TO ASIA 2026",
    startDate: '2026-07-19',
    endDate: '2026-07-19',
    venue: 'Asia World-Expo',
    city: '香港',
    country: 'HK',
    ticketSaleStart: '2026-05-18',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'HK Ticketing', url: 'https://www.hkticketing.com', region: 'HK' },
    ],
  },

  // ── Stray Kids ────────────────────────────────────────────────────────────
  {
    id: 'skz-KR-0606',
    artist: 'Stray Kids',
    tourName: 'Stray Kids 5-STAR DOME TOUR 2026',
    startDate: '2026-06-06',
    endDate: '2026-06-07',
    venue: '고척스카이돔',
    city: '首爾',
    country: 'KR',
    ticketSaleStart: '2026-04-05',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Melon Ticket', url: 'https://ticket.melon.com', region: 'KR' },
      { name: 'Ticketlink', url: 'https://www.ticketlink.co.kr', region: 'KR' },
    ],
  },
  {
    id: 'skz-JP-0627',
    artist: 'Stray Kids',
    tourName: 'Stray Kids 5-STAR DOME TOUR 2026',
    startDate: '2026-06-27',
    endDate: '2026-06-28',
    venue: '京セラドーム大阪',
    city: '大阪',
    country: 'JP',
    ticketSaleStart: '2026-04-26',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'e+', url: 'https://eplus.jp', region: 'JP' },
      { name: 'Lawson Ticket', url: 'https://l-tike.com', region: 'JP' },
    ],
  },
  {
    id: 'skz-JP-0711',
    artist: 'Stray Kids',
    tourName: 'Stray Kids 5-STAR DOME TOUR 2026',
    startDate: '2026-07-11',
    endDate: '2026-07-12',
    venue: '東京ドーム',
    city: '東京',
    country: 'JP',
    ticketSaleStart: '2026-05-10',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Lawson Ticket', url: 'https://l-tike.com', region: 'JP' },
      { name: 'TicketPia', url: 'https://t.pia.jp', region: 'JP' },
    ],
  },
  {
    id: 'skz-HK-0801',
    artist: 'Stray Kids',
    tourName: 'Stray Kids 5-STAR DOME TOUR 2026',
    startDate: '2026-08-01',
    endDate: '2026-08-02',
    venue: '紅磡香港體育館 (Hong Kong Coliseum)',
    city: '香港',
    country: 'HK',
    ticketSaleStart: '2026-06-07',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'HK Ticketing', url: 'https://www.hkticketing.com', region: 'HK' },
      { name: 'cityline', url: 'https://www.cityline.com', region: 'HK' },
    ],
  },

  // ── TXT (Tomorrow X Together) ─────────────────────────────────────────────
  {
    id: 'txt-KR-0516',
    artist: 'TOMORROW X TOGETHER',
    tourName: "TOMORROW X TOGETHER WORLD TOUR 'ACT : PROMISE'",
    startDate: '2026-05-16',
    endDate: '2026-05-17',
    venue: 'KSPO Dome (올림픽체조경기장)',
    city: '首爾',
    country: 'KR',
    ticketSaleStart: '2026-03-15',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Weverse Shop', url: 'https://weverseshop.io', region: 'KR' },
      { name: 'Melon Ticket', url: 'https://ticket.melon.com', region: 'KR' },
    ],
  },
  {
    id: 'txt-JP-0606',
    artist: 'TOMORROW X TOGETHER',
    tourName: "TOMORROW X TOGETHER WORLD TOUR 'ACT : PROMISE'",
    startDate: '2026-06-06',
    endDate: '2026-06-07',
    venue: '国立代々木競技場 第一体育館',
    city: '東京',
    country: 'JP',
    ticketSaleStart: '2026-04-05',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Weverse Shop', url: 'https://weverseshop.io', region: 'JP' },
      { name: 'Lawson Ticket', url: 'https://l-tike.com', region: 'JP' },
    ],
  },
  {
    id: 'txt-HK-0704',
    artist: 'TOMORROW X TOGETHER',
    tourName: "TOMORROW X TOGETHER WORLD TOUR 'ACT : PROMISE'",
    startDate: '2026-07-04',
    endDate: '2026-07-05',
    venue: 'Asia World-Expo',
    city: '香港',
    country: 'HK',
    ticketSaleStart: '2026-05-03',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Weverse Shop', url: 'https://weverseshop.io', region: 'HK' },
      { name: 'HK Ticketing', url: 'https://www.hkticketing.com', region: 'HK' },
    ],
  },
  {
    id: 'txt-TW-0725',
    artist: 'TOMORROW X TOGETHER',
    tourName: "TOMORROW X TOGETHER WORLD TOUR 'ACT : PROMISE'",
    startDate: '2026-07-25',
    endDate: '2026-07-26',
    venue: '台北小巨蛋',
    city: '台北',
    country: 'TW',
    ticketSaleStart: '2026-05-24',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Weverse Shop', url: 'https://weverseshop.io', region: 'TW' },
      { name: 'KKTIX', url: 'https://kktix.com', region: 'TW' },
    ],
  },

  // ── BTS Jin (Kim Seok-jin solo) ───────────────────────────────────────────
  {
    id: 'jin-KR-0620',
    artist: 'KIM SEOK-JIN (BTS Jin)',
    tourName: "KIM SEOK-JIN WORLD TOUR 'I LOVE YOU SO S...'",
    startDate: '2026-06-20',
    endDate: '2026-06-21',
    venue: '잠실주경기장 (서울올림픽주경기장)',
    city: '首爾',
    country: 'KR',
    ticketSaleStart: '2026-04-19',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Weverse Shop', url: 'https://weverseshop.io', region: 'KR' },
      { name: 'Melon Ticket', url: 'https://ticket.melon.com', region: 'KR' },
    ],
  },
  {
    id: 'jin-JP-0725',
    artist: 'KIM SEOK-JIN (BTS Jin)',
    tourName: "KIM SEOK-JIN WORLD TOUR 'I LOVE YOU SO S...'",
    startDate: '2026-07-25',
    endDate: '2026-07-26',
    venue: '国立代々木競技場 第一体育館',
    city: '東京',
    country: 'JP',
    ticketSaleStart: '2026-05-24',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Weverse Shop', url: 'https://weverseshop.io', region: 'JP' },
      { name: 'Lawson Ticket', url: 'https://l-tike.com', region: 'JP' },
    ],
  },
  {
    id: 'jin-TW-0905',
    artist: 'KIM SEOK-JIN (BTS Jin)',
    tourName: "KIM SEOK-JIN WORLD TOUR 'I LOVE YOU SO S...'",
    startDate: '2026-09-05',
    endDate: '2026-09-06',
    venue: '台北小巨蛋',
    city: '台北',
    country: 'TW',
    ticketSaleStart: '2026-07-05',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Weverse Shop', url: 'https://weverseshop.io', region: 'TW' },
      { name: 'KKTIX', url: 'https://kktix.com', region: 'TW' },
    ],
  },

  // ── NewJeans ──────────────────────────────────────────────────────────────
  {
    id: 'nj-KR-0705',
    artist: 'NewJeans',
    tourName: "NewJeans 1st World Tour 'BUNNIES CAMP 2026'",
    startDate: '2026-07-05',
    endDate: '2026-07-06',
    venue: '서울월드컵경기장',
    city: '首爾',
    country: 'KR',
    ticketSaleStart: '2026-05-04',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Melon Ticket', url: 'https://ticket.melon.com', region: 'KR' },
      { name: 'YES24 Live', url: 'https://ticket.yes24.com', region: 'KR' },
    ],
  },
  {
    id: 'nj-JP-0801',
    artist: 'NewJeans',
    tourName: "NewJeans 1st World Tour 'BUNNIES CAMP 2026'",
    startDate: '2026-08-01',
    endDate: '2026-08-02',
    venue: '国立代々木競技場 第一体育館',
    city: '東京',
    country: 'JP',
    ticketSaleStart: '2026-06-01',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'e+', url: 'https://eplus.jp', region: 'JP' },
      { name: 'Lawson Ticket', url: 'https://l-tike.com', region: 'JP' },
    ],
  },
  {
    id: 'nj-TW-0822',
    artist: 'NewJeans',
    tourName: "NewJeans 1st World Tour 'BUNNIES CAMP 2026'",
    startDate: '2026-08-22',
    endDate: '2026-08-23',
    venue: '台北小巨蛋',
    city: '台北',
    country: 'TW',
    ticketSaleStart: '2026-06-21',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'KKTIX', url: 'https://kktix.com', region: 'TW' },
      { name: '拓元售票', url: 'https://www.tixcraft.com', region: 'TW' },
    ],
  },

  // ── EXO Baekhyun ─────────────────────────────────────────────────────────
  {
    id: 'baekhyun-KR-0530',
    artist: '백현 BAEKHYUN (EXO)',
    tourName: "BAEKHYUN SOLO CONCERT 2026 'AMUSEMENT PARK'",
    startDate: '2026-05-30',
    endDate: '2026-05-31',
    venue: '올림픽공원 Olympic Hall',
    city: '首爾',
    country: 'KR',
    ticketSaleStart: '2026-03-29',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'Melon Ticket', url: 'https://ticket.melon.com', region: 'KR' },
      { name: 'Interpark', url: 'https://ticket.interpark.com', region: 'KR' },
    ],
  },
  {
    id: 'baekhyun-JP-0620',
    artist: '백현 BAEKHYUN (EXO)',
    tourName: "BAEKHYUN SOLO CONCERT 2026 'AMUSEMENT PARK'",
    startDate: '2026-06-20',
    endDate: '2026-06-21',
    venue: 'Zepp Shinjuku',
    city: '東京',
    country: 'JP',
    ticketSaleStart: '2026-04-19',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'e+', url: 'https://eplus.jp', region: 'JP' },
      { name: 'Lawson Ticket', url: 'https://l-tike.com', region: 'JP' },
    ],
  },
  {
    id: 'baekhyun-TW-0704',
    artist: '백현 BAEKHYUN (EXO)',
    tourName: "BAEKHYUN SOLO CONCERT 2026 'AMUSEMENT PARK'",
    startDate: '2026-07-04',
    endDate: '2026-07-04',
    venue: '台北流行音樂中心',
    city: '台北',
    country: 'TW',
    ticketSaleStart: '2026-05-03',
    ticketSaleEnd: null,
    ticketPlatforms: [
      { name: 'KKTIX', url: 'https://kktix.com', region: 'TW' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Filter logic
// ---------------------------------------------------------------------------

const TODAY = new Date().toISOString().split('T')[0]

function isShowActive(show: ConcertShow): boolean {
  if (show.endDate < TODAY) return false
  if (show.ticketSaleEnd !== null && show.ticketSaleEnd < TODAY) return false
  return true
}

export function getTicketStatus(show: ConcertShow): 'on-sale' | 'upcoming' {
  return show.ticketSaleStart <= TODAY ? 'on-sale' : 'upcoming'
}

function applyFilter(shows: ConcertShow[], filter: ConcertFilter): ConcertShow[] {
  return shows.filter((s) => {
    if (filter.countries.length && !filter.countries.includes(s.country)) return false
    if (filter.search) {
      const q = filter.search.toLowerCase()
      if (!s.artist.toLowerCase().includes(q) && !s.tourName.toLowerCase().includes(q)) return false
    }
    return true
  })
}

// ---------------------------------------------------------------------------
// Gemini API placeholder（待 API quota 解決後啟用）
// ---------------------------------------------------------------------------

// async function getConcertsFromGemini(): Promise<ConcertShow[]> {
//   const { GoogleGenAI } = await import('@google/genai')
//   const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })
//   const result = await ai.models.generateContent({
//     model: 'gemini-2.0-flash',
//     contents: `請搜尋 2026 年已公告的所有韓國藝人演唱會，包含海外場次（日本/台灣/港澳），以 JSON 陣列回傳...`,
//     config: { tools: [{ googleSearch: {} }] },
//   })
//   return JSON.parse(result.text ?? '[]')
// }

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getConcerts(filter: ConcertFilter): Promise<ConcertShow[]> {
  const active = ALL_SHOWS.filter(isShowActive)
  return applyFilter(active, filter).sort((a, b) => a.startDate.localeCompare(b.startDate))
}
