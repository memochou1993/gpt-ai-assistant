<template>
  <div>
    <ConcertFilters @filter="applyFilter" />

    <div class="list-header">
      <span class="list-count">共 {{ shows.length }} 場</span>
      <span class="list-note">已排除結束場次與售票截止場次 · 依日期排序</span>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="spinner" />
      載入中…
    </div>

    <div v-else-if="shows.length === 0" class="empty-state">
      <div class="empty-icon">🎤</div>
      <p>找不到符合條件的演唱會</p>
    </div>

    <ul v-else class="concert-list">
      <ConcertCard v-for="show in shows" :key="show.id" :show="show" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ConcertFilters from './ConcertFilters.vue'
import ConcertCard from './ConcertCard.vue'
import { getConcerts } from '../../services/concertService'
import type { ConcertShow, ConcertFilter } from '../../types/concert'

const shows = ref<ConcertShow[]>([])
const loading = ref(false)

const currentFilter: ConcertFilter = { countries: ['KR', 'JP', 'TW', 'HK'], search: '' }

async function loadShows() {
  loading.value = true
  shows.value = await getConcerts({ ...currentFilter })
  loading.value = false
}

async function applyFilter(f: ConcertFilter) {
  currentFilter.countries = f.countries
  currentFilter.search = f.search
  shows.value = await getConcerts({ ...currentFilter })
}

onMounted(loadShows)
</script>

<style scoped>
.list-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.25rem 0 0.75rem;
  flex-wrap: wrap;
}

.list-count {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a202c;
}

.list-note {
  font-size: 0.78rem;
  color: #a0aec0;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  justify-content: center;
  color: #a0aec0;
}

.spinner {
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #e2e8f0;
  border-top-color: #e91e8c;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #a0aec0;
}

.empty-icon { font-size: 3rem; margin-bottom: 0.75rem; }
.empty-state p { font-size: 1rem; margin: 0; }

.concert-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1rem;
}
</style>
