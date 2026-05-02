<template>
  <div class="search-card">
    <h2 class="search-title">搜尋航班</h2>

    <form class="search-form" @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group">
          <label for="origin" class="form-label">
            <span class="label-icon">✈</span> 出發地
          </label>
          <input
            id="origin"
            v-model="form.origin"
            type="text"
            class="form-input"
            placeholder="例如：台北、TPE"
            required
          />
        </div>

        <button type="button" class="swap-btn" title="交換出發地與目的地" @click="swapLocations">
          ⇄
        </button>

        <div class="form-group">
          <label for="destination" class="form-label">
            <span class="label-icon">🏁</span> 目的地
          </label>
          <input
            id="destination"
            v-model="form.destination"
            type="text"
            class="form-input"
            placeholder="例如：東京、NRT"
            required
          />
        </div>

        <div class="form-group form-group--date">
          <label for="date" class="form-label">
            <span class="label-icon">📅</span> 出發日期
          </label>
          <input
            id="date"
            v-model="form.date"
            type="date"
            class="form-input"
            :min="today"
            required
          />
        </div>
      </div>

      <button type="submit" class="search-btn" :disabled="loading">
        <span v-if="loading" class="spinner" />
        {{ loading ? '搜尋中...' : '搜尋航班' }}
      </button>
    </form>

    <div class="quick-routes">
      <span class="quick-label">熱門航線：</span>
      <button
        v-for="route in quickRoutes"
        :key="route.label"
        type="button"
        class="quick-btn"
        @click="applyQuickRoute(route)"
      >
        {{ route.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { FlightSearchParams } from '../../types/flight'

const emit = defineEmits<{ search: [params: FlightSearchParams] }>()
defineProps<{ loading: boolean }>()

const form = reactive<FlightSearchParams>({ origin: '', destination: '', date: '' })
const today = computed(() => new Date().toISOString().split('T')[0])

const quickRoutes = [
  { label: '台北 → 東京', origin: '台北', destination: '東京' },
  { label: '台北 → 香港', origin: '台北', destination: '香港' },
  { label: '台北 → 新加坡', origin: '台北', destination: '新加坡' },
]

function swapLocations() {
  const tmp = form.origin
  form.origin = form.destination
  form.destination = tmp
}

function applyQuickRoute(route: { origin: string; destination: string }) {
  form.origin = route.origin
  form.destination = route.destination
}

function handleSubmit() {
  emit('search', { ...form })
}
</script>

<style scoped>
.search-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}
.search-title { font-size: 1.4rem; font-weight: 700; color: #1a202c; margin: 0 0 1.5rem; }
.search-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-row { display: flex; align-items: flex-end; gap: 0.75rem; flex-wrap: wrap; }
.form-group { flex: 1; min-width: 180px; display: flex; flex-direction: column; gap: 0.4rem; }
.form-group--date { min-width: 160px; flex: 0 0 auto; }
.form-label { font-size: 0.85rem; font-weight: 600; color: #4a5568; display: flex; align-items: center; gap: 0.3rem; }
.form-input { padding: 0.65rem 0.9rem; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; color: #1a202c; outline: none; background: #f7fafc; font-family: inherit; transition: border-color 0.2s; }
.form-input:focus { border-color: #4299e1; background: #fff; box-shadow: 0 0 0 3px rgba(66,153,225,0.15); }
.swap-btn { background: #ebf8ff; border: 1.5px solid #bee3f8; border-radius: 8px; width: 2.4rem; height: 2.4rem; font-size: 1.1rem; color: #2b6cb0; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; align-self: flex-end; transition: background 0.2s; }
.swap-btn:hover { background: #bee3f8; }
.search-btn { background: #3182ce; color: #fff; border: none; border-radius: 10px; padding: 0.8rem 1.5rem; font-size: 1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-family: inherit; transition: background 0.2s; }
.search-btn:hover:not(:disabled) { background: #2b6cb0; }
.search-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner { width: 1rem; height: 1rem; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.quick-routes { margin-top: 1rem; display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.quick-label { font-size: 0.82rem; color: #718096; }
.quick-btn { background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 0.3rem 0.8rem; font-size: 0.82rem; color: #2d3748; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.quick-btn:hover { background: #ebf8ff; border-color: #90cdf4; color: #2b6cb0; }
</style>
