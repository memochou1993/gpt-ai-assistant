<template>
  <div class="filters">
    <div class="filter-group">
      <span class="filter-label">地區</span>
      <div class="country-btns">
        <button
          v-for="(label, code) in COUNTRY_LABEL"
          :key="code"
          :class="['country-btn', { active: selected.includes(code as Country) }]"
          type="button"
          @click="toggleCountry(code as Country)"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <div class="filter-group filter-group--search">
      <span class="filter-label">搜尋藝人</span>
      <input
        v-model="searchText"
        type="text"
        class="search-input"
        placeholder="輸入藝人或演唱會名稱…"
        @input="emitFilter"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Country, ConcertFilter } from '../../types/concert'
import { COUNTRY_LABEL } from '../../types/concert'

const emit = defineEmits<{ filter: [f: ConcertFilter] }>()

const ALL_COUNTRIES: Country[] = ['KR', 'JP', 'TW', 'HK']
const selected = ref<Country[]>([...ALL_COUNTRIES])
const searchText = ref('')

function toggleCountry(code: Country) {
  const idx = selected.value.indexOf(code)
  if (idx >= 0) {
    if (selected.value.length === 1) return  // 至少保留一個
    selected.value.splice(idx, 1)
  } else {
    selected.value.push(code)
  }
  emitFilter()
}

function emitFilter() {
  emit('filter', { countries: [...selected.value], search: searchText.value })
}
</script>

<style scoped>
.filters {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 1.25rem 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group--search {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #718096;
}

.country-btns {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.country-btn {
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #f7fafc;
  color: #4a5568;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.country-btn.active {
  border-color: #e91e8c;
  background: #fff0f7;
  color: #c2185b;
  font-weight: 600;
}

.country-btn:hover:not(.active) {
  border-color: #cbd5e0;
  background: #edf2f7;
}

.search-input {
  padding: 0.55rem 0.9rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1a202c;
  outline: none;
  background: #f7fafc;
  font-family: inherit;
  width: 100%;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #e91e8c;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(233, 30, 140, 0.1);
}
</style>
