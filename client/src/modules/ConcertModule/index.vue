<template>
  <div>
    <ConcertFilters @filter="applyFilter" />

    <!-- Loading -->
    <div v-if="loading" class="status-state">
      <span class="spinner" />
      <span>正在透過 Gemini AI 搜尋最新演唱會資訊…</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-banner">
      <div class="error-title">⚠️ 無法取得資料</div>
      <div class="error-msg">{{ error }}</div>
      <button class="retry-btn" @click="loadShows">重新嘗試</button>
    </div>

    <template v-else>
      <div class="list-header">
        <span class="list-count">共 {{ shows.length }} 場</span>
        <span class="list-note">資料由 Gemini AI + Google 搜尋即時提供 · 依日期排序</span>
      </div>

      <div v-if="shows.length === 0" class="status-state">
        <div class="empty-icon">🎤</div>
        <p>目前沒有符合條件的演唱會</p>
      </div>

      <ul v-else class="concert-list">
        <ConcertCard v-for="show in shows" :key="show.id" :show="show" />
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ConcertFilters from './ConcertFilters.vue'
import ConcertCard from './ConcertCard.vue'
import { fetchConcerts, filterConcerts } from '../../services/concertService'
import type { ConcertShow, ConcertFilter } from '../../types/concert'

const allShows = ref<ConcertShow[]>([])   // API 原始資料（本次瀏覽快取）
const shows = ref<ConcertShow[]>([])      // 套用篩選後顯示的資料
const loading = ref(false)
const error = ref<string | null>(null)

const currentFilter: ConcertFilter = { countries: ['KR', 'JP', 'TW', 'HK'], search: '' }

async function loadShows() {
  loading.value = true
  error.value = null
  try {
    allShows.value = await fetchConcerts()   // 只在頁面載入時打一次 API
    shows.value = filterConcerts(allShows.value, { ...currentFilter })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('429')) {
      error.value = 'Gemini API 免費額度已用盡，請至 Google AI Studio 開通付費方案後重試。'
    } else if (msg.includes('API key')) {
      error.value = 'API Key 無效，請確認 .env 中的 VITE_GEMINI_API_KEY 設定是否正確。'
    } else {
      error.value = `搜尋失敗：${msg}`
    }
  } finally {
    loading.value = false
  }
}

function applyFilter(f: ConcertFilter) {
  currentFilter.countries = f.countries
  currentFilter.search = f.search
  shows.value = filterConcerts(allShows.value, { ...currentFilter })  // 不重打 API
}

onMounted(loadShows)
</script>

<style scoped>
.status-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75rem;
  padding: 4rem 1rem;
  color: #a0aec0;
  font-size: 0.95rem;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e2e8f0;
  border-top-color: #e91e8c;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-icon { font-size: 3rem; }

.error-banner {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-title {
  font-weight: 700;
  color: #c53030;
  font-size: 0.95rem;
}

.error-msg {
  color: #742a2a;
  font-size: 0.88rem;
  line-height: 1.5;
}

.retry-btn {
  align-self: flex-start;
  margin-top: 0.25rem;
  padding: 0.4rem 1rem;
  background: #e53e3e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}

.retry-btn:hover { background: #c53030; }

.list-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.25rem 0 0.75rem;
  flex-wrap: wrap;
}

.list-count { font-size: 0.95rem; font-weight: 700; color: #1a202c; }
.list-note { font-size: 0.78rem; color: #a0aec0; }

.concert-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1rem;
}
</style>
