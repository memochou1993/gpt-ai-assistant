<template>
  <div class="results-wrapper">
    <div v-if="!searched" class="empty-state">
      <div class="empty-icon">✈</div>
      <p>請輸入出發地、目的地與日期後點擊搜尋</p>
    </div>

    <div v-else-if="result && result.totalCount === 0" class="empty-state">
      <div class="empty-icon">😕</div>
      <p>找不到符合條件的航班</p>
      <span class="empty-hint">請嘗試調整出發地或目的地</span>
    </div>

    <template v-else-if="result">
      <div class="results-header">
        <h3 class="results-title">{{ result.searchParams.origin }} → {{ result.searchParams.destination }}</h3>
        <span class="results-meta">{{ result.searchParams.date }} &nbsp;·&nbsp; 共 {{ result.totalCount }} 個航班</span>
      </div>

      <ul class="flight-list">
        <li v-for="flight in result.flights" :key="flight.id" class="flight-card">
          <div class="flight-airline">
            <span class="airline-badge">{{ flight.airlineCode }}</span>
            <span class="airline-name">{{ flight.airline }}</span>
            <span class="flight-number">{{ flight.flightNumber }}</span>
          </div>

          <div class="flight-times">
            <div class="time-block">
              <span class="time">{{ flight.departureTime }}</span>
              <span class="iata">{{ flight.originCode }}</span>
            </div>
            <div class="flight-duration">
              <span class="duration-line" />
              <span class="duration-text">{{ flight.duration }}</span>
              <span class="duration-line" />
            </div>
            <div class="time-block">
              <span class="time">{{ flight.arrivalTime }}</span>
              <span class="iata">{{ flight.destinationCode }}</span>
            </div>
          </div>

          <div class="flight-info">
            <span :class="['cabin-badge', `cabin-badge--${flight.cabinClass}`]">{{ cabinLabel(flight.cabinClass) }}</span>
            <span :class="['seats', flight.seatsAvailable <= 10 ? 'seats--low' : '']">
              {{ flight.seatsAvailable <= 10 ? `僅剩 ${flight.seatsAvailable} 席` : `剩 ${flight.seatsAvailable} 席` }}
            </span>
          </div>

          <div class="flight-price">
            <span class="price-amount">{{ formatPrice(flight.price) }}</span>
            <span class="price-currency">{{ flight.currency }}</span>
            <button class="book-btn">選擇</button>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { FlightSearchResult } from '../../types/flight'

defineProps<{ result: FlightSearchResult | null; searched: boolean }>()

function cabinLabel(cabin: string): string {
  return ({ economy: '經濟艙', business: '商務艙', first: '頭等艙' } as Record<string, string>)[cabin] ?? cabin
}

function formatPrice(price: number): string {
  return price.toLocaleString('zh-TW')
}
</script>

<style scoped>
.results-wrapper { margin-top: 1.5rem; }
.empty-state { text-align: center; padding: 3rem 1rem; color: #a0aec0; }
.empty-icon { font-size: 3rem; margin-bottom: 0.75rem; }
.empty-state p { font-size: 1rem; margin: 0; }
.empty-hint { font-size: 0.85rem; color: #cbd5e0; }
.results-header { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
.results-title { font-size: 1.2rem; font-weight: 700; color: #1a202c; margin: 0; }
.results-meta { font-size: 0.85rem; color: #718096; }
.flight-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
.flight-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); padding: 1.2rem 1.4rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; transition: box-shadow 0.2s; }
.flight-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
.flight-airline { display: flex; flex-direction: column; align-items: flex-start; min-width: 90px; }
.airline-badge { background: #ebf8ff; color: #2b6cb0; border-radius: 6px; padding: 0.15rem 0.5rem; font-size: 0.8rem; font-weight: 700; }
.airline-name { font-size: 0.82rem; color: #4a5568; margin-top: 0.25rem; }
.flight-number { font-size: 0.78rem; color: #a0aec0; }
.flight-times { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 200px; }
.time-block { display: flex; flex-direction: column; align-items: center; }
.time { font-size: 1.3rem; font-weight: 700; color: #1a202c; }
.iata { font-size: 0.78rem; color: #718096; letter-spacing: 0.05em; }
.flight-duration { display: flex; align-items: center; gap: 0.4rem; flex: 1; flex-direction: column; }
.duration-text { font-size: 0.78rem; color: #a0aec0; white-space: nowrap; }
.duration-line { flex: 1; height: 1px; background: #e2e8f0; width: 100%; }
.flight-info { display: flex; flex-direction: column; align-items: flex-start; gap: 0.3rem; min-width: 72px; }
.cabin-badge { border-radius: 20px; padding: 0.15rem 0.6rem; font-size: 0.75rem; font-weight: 600; }
.cabin-badge--economy { background: #f0fff4; color: #276749; }
.cabin-badge--business { background: #fefcbf; color: #744210; }
.cabin-badge--first { background: #fff5f5; color: #742a2a; }
.seats { font-size: 0.78rem; color: #718096; }
.seats--low { color: #e53e3e; font-weight: 600; }
.flight-price { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; margin-left: auto; }
.price-amount { font-size: 1.4rem; font-weight: 700; color: #2d3748; line-height: 1; }
.price-currency { font-size: 0.78rem; color: #a0aec0; }
.book-btn { background: #3182ce; color: #fff; border: none; border-radius: 8px; padding: 0.45rem 1.1rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.book-btn:hover { background: #2b6cb0; }
</style>
