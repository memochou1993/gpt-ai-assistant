<template>
  <div>
    <FlightSearch :loading="loading" @search="handleSearch" />

    <div v-if="error" class="error-banner">{{ error }}</div>

    <FlightResults :result="searchResult" :searched="searched" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FlightSearch from './FlightSearch.vue'
import FlightResults from './FlightResults.vue'
import { searchFlights } from '../../services/flightService'
import type { FlightSearchParams, FlightSearchResult } from '../../types/flight'

const loading = ref(false)
const searched = ref(false)
const error = ref<string | null>(null)
const searchResult = ref<FlightSearchResult | null>(null)

async function handleSearch(params: FlightSearchParams) {
  loading.value = true
  error.value = null
  searched.value = true
  try {
    searchResult.value = await searchFlights(params)
  } catch {
    error.value = '查詢失敗，請稍後再試。'
    searchResult.value = null
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.error-banner {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
