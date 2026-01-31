<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useEntertainmentStore } from '../stores/entertainment'

const route = useRoute()
const store = useEntertainmentStore()
const isMenuOpen = ref(false)

const navItems = [
  { path: '/', name: '首页', icon: '🏠' },
  { path: '/games', name: '游戏', icon: '🎮' },
  { path: '/jokes', name: '笑话', icon: '😄' },
  { path: '/music', name: '音乐', icon: '🎵' },
  { path: '/tools', name: '工具', icon: '🛠️' }
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">🎪</span>
        <span class="logo-text">娱乐天地</span>
      </router-link>
      
      <div class="nav-links" :class="{ 'nav-open': isMenuOpen }">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: route.path === item.path }"
          @click="isMenuOpen = false"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </div>
      
      <div class="nav-actions">
        <button class="theme-toggle" @click="store.toggleTheme">
          {{ store.currentTheme === 'light' ? '🌙' : '☀️' }}
        </button>
        <button class="menu-toggle" @click="toggleMenu">
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius);
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
}

.nav-link.active {
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.15);
}

.nav-icon {
  font-size: 1.125rem;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--bg-tertiary);
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: var(--border-color);
  transform: scale(1.1);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-bar {
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .nav-links {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    border-bottom: 1px solid var(--border-color);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-links.nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-link {
    width: 100%;
    padding: 0.75rem 1rem;
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .nav-open + .nav-actions .menu-toggle .menu-bar:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .nav-open + .nav-actions .menu-toggle .menu-bar:nth-child(2) {
    opacity: 0;
  }
  
  .nav-open + .nav-actions .menu-toggle .menu-bar:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
}
</style>
