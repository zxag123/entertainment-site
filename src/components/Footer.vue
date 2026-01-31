<script setup lang="ts">
import { useEntertainmentStore } from '../stores/entertainment'

const store = useEntertainmentStore()

const currentYear = new Date().getFullYear()

const footerLinks = [
  { name: '关于我们', href: '#' },
  { name: '联系方式', href: '#' },
  { name: '隐私政策', href: '#' },
  { name: '使用条款', href: '#' }
]

const socialLinks = [
  { name: 'GitHub', icon: '🐙', href: '#' },
  { name: 'Twitter', icon: '🐦', href: '#' },
  { name: 'Discord', icon: '💬', href: '#' }
]
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-icon">🎪</span>
            <span class="logo-text">娱乐天地</span>
          </div>
          <p class="footer-description">
            您的在线娱乐中心，提供各种有趣的小游戏、笑话、音乐和实用工具。
          </p>
          <div class="footer-stats">
            <div class="stat-item">
              <span class="stat-value">{{ store.favoritesCount }}</span>
              <span class="stat-label">收藏笑话</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ store.totalScore }}</span>
              <span class="stat-label">游戏总分</span>
            </div>
          </div>
        </div>
        
        <div class="footer-links">
          <h4 class="footer-title">快速链接</h4>
          <ul class="footer-list">
            <li v-for="link in footerLinks" :key="link.name">
              <a :href="link.href" class="footer-link">{{ link.name }}</a>
            </li>
          </ul>
        </div>
        
        <div class="footer-social">
          <h4 class="footer-title">关注我们</h4>
          <div class="social-links">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              class="social-link"
              :title="social.name"
            >
              <span class="social-icon">{{ social.icon }}</span>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} 娱乐天地. All rights reserved.
        </p>
        <p class="made-with">
          Made with 💜 using Vue 3
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 3rem 0 1.5rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.footer-brand {
  max-width: 320px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
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

.footer-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.footer-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.footer-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.footer-list {
  list-style: none;
}

.footer-list li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
}

.social-icon {
  font-size: 1.25rem;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-brand {
    max-width: 100%;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
