<template>
  <li class="concert-card">
    <!-- Status badge -->
    <span :class="['status-badge', status === 'on-sale' ? 'status-badge--sale' : 'status-badge--upcoming']">
      {{ status === 'on-sale' ? '🟢 搶票中' : '🟡 即將開售' }}
    </span>

    <!-- Artist & tour -->
    <div class="card-main">
      <div class="artist-name">{{ show.artist }}</div>
      <div class="tour-name">{{ show.tourName }}</div>
    </div>

    <!-- Date & venue -->
    <div class="card-info">
      <div class="info-row">
        <span class="info-icon">📅</span>
        <span>{{ formatDateRange(show.startDate, show.endDate) }}</span>
      </div>
      <div class="info-row">
        <span class="info-icon">📍</span>
        <span>{{ COUNTRY_LABEL[show.country] }}&nbsp; {{ show.city }} · {{ show.venue }}</span>
      </div>
      <div class="info-row">
        <span class="info-icon">🎫</span>
        <span>
          開售：{{ formatDate(show.ticketSaleStart) }}
          <template v-if="show.ticketSaleEnd"> ～ {{ formatDate(show.ticketSaleEnd) }}</template>
        </span>
      </div>
    </div>

    <!-- Ticket platforms -->
    <div class="platforms">
      <a
        v-for="p in show.ticketPlatforms"
        :key="p.name"
        :href="p.url"
        target="_blank"
        rel="noopener noreferrer"
        class="platform-btn"
      >
        {{ p.name }}
      </a>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { ConcertShow } from '../../types/concert'
import { COUNTRY_LABEL } from '../../types/concert'
import { getTicketStatus } from '../../services/concertService'

const props = defineProps<{ show: ConcertShow }>()
const status = getTicketStatus(props.show)

function formatDate(d: string): string {
  const [y, m, day] = d.split('-')
  return `${y}/${m}/${day}`
}

function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start)
  const [, em, ed] = end.split('-')
  return `${formatDate(start)} ～ ${em}/${ed}`
}
</script>

<style scoped>
.concert-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.07);
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  position: relative;
  transition: box-shadow 0.2s;
  border-left: 4px solid #e91e8c;
}

.concert-card:hover {
  box-shadow: 0 6px 24px rgba(233, 30, 140, 0.12);
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
}

.status-badge--sale {
  background: #f0fff4;
  color: #276749;
}

.status-badge--upcoming {
  background: #fffbeb;
  color: #744210;
}

.artist-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a202c;
}

.tour-name {
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.15rem;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.88rem;
  color: #2d3748;
}

.info-icon {
  flex-shrink: 0;
  font-size: 0.9rem;
}

.platforms {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.2rem;
}

.platform-btn {
  background: #fff0f7;
  color: #c2185b;
  border: 1.5px solid #f48fb1;
  border-radius: 20px;
  padding: 0.28rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  font-family: inherit;
}

.platform-btn:hover {
  background: #e91e8c;
  color: #fff;
  border-color: #e91e8c;
}
</style>
