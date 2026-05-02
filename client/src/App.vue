<template>
  <div class="page">
    <header class="header">
      <div class="header-inner">
        <span class="logo">🌏 旅遊資訊平台</span>
        <nav class="nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['nav-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </nav>
      </div>
    </header>

    <main class="main">
      <FlightModule v-if="activeTab === 'flight'" />
      <ConcertModule v-else-if="activeTab === 'concert'" />
    </main>

    <footer class="footer">
      <p>資料僅供展示用途 · Powered by Gemini AI</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FlightModule from './modules/FlightModule/index.vue'
import ConcertModule from './modules/ConcertModule/index.vue'

const tabs = [
  { id: 'flight', icon: '✈', label: '航班查詢' },
  { id: 'concert', icon: '🎤', label: '韓星演唱會' },
]

const activeTab = ref<'flight' | 'concert'>('flight')
</script>

<style>
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
  background: linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%);
  min-height: 100vh;
  color: #1a202c;
}

.page { min-height: 100vh; display: flex; flex-direction: column; }

.header {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  padding: 0.75rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: #c2185b;
  white-space: nowrap;
}

.nav { display: flex; gap: 0.5rem; }

.nav-btn {
  padding: 0.45rem 1.1rem;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: transparent;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.nav-btn:hover:not(.active) {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.nav-btn.active {
  background: #e91e8c;
  border-color: #e91e8c;
  color: #fff;
}

.main {
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 1rem;
}

.footer {
  text-align: center;
  padding: 1.5rem;
  font-size: 0.78rem;
  color: #a0aec0;
}
</style>
