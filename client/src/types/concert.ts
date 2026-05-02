export type Country = 'KR' | 'TW' | 'JP' | 'HK'
export type CabinClass = 'economy' | 'business' | 'first'

export interface TicketPlatform {
  name: string
  url: string
  region: Country
}

export interface ConcertShow {
  id: string
  artist: string
  tourName: string
  startDate: string       // YYYY-MM-DD
  endDate: string         // YYYY-MM-DD
  venue: string
  city: string
  country: Country
  ticketSaleStart: string // YYYY-MM-DD
  ticketSaleEnd: string | null  // null = still on sale
  ticketPlatforms: TicketPlatform[]
}

export interface ConcertFilter {
  countries: Country[]
  search: string
}

export const COUNTRY_LABEL: Record<Country, string> = {
  KR: '🇰🇷 韓國',
  JP: '🇯🇵 日本',
  TW: '🇹🇼 台灣',
  HK: '🇭🇰 港澳',
}
