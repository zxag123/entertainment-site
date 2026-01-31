<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    title: '趣味游戏',
    description: '各种休闲小游戏，打发无聊时光',
    icon: '🎮',
    color: '#6366f1',
    path: '/games'
  },
  {
    title: '开心笑话',
    description: '精选幽默笑话，让你开怀大笑',
    icon: '😄',
    color: '#ec4899',
    path: '/jokes'
  },
  {
    title: '音乐放松',
    description: '精选音乐，放松心情',
    icon: '🎵',
    color: '#f59e0b',
    path: '/music'
  },
  {
    title: '实用工具',
    description: '各种实用小工具，方便生活',
    icon: '🛠️',
    color: '#10b981',
    path: '/tools'
  }
]

const stats = [
  { value: '10+', label: '趣味游戏' },
  { value: '100+', label: '精选笑话' },
  { value: '50+', label: '音乐曲目' },
  { value: '20+', label: '实用工具' }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-shape shape-1"></div>
        <div class="hero-shape shape-2"></div>
        <div class="hero-shape shape-3"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">欢迎来到</span>
            <br />
            <span class="hero-brand">娱乐天地 🎪</span>
          </h1>
          <p class="hero-description">
            您的在线娱乐中心，提供各种有趣的小游戏、笑话、音乐和实用工具。
            <br />
            在这里，您可以尽情放松，享受快乐时光！
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" @click="navigateTo('/games')">
              <span>🎮</span>
              开始游戏
            </button>
            <button class="btn btn-secondary btn-lg" @click="navigateTo('/jokes')">
              <span>😄</span>
              看笑话
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">探索功能</h2>
          <p class="section-subtitle">发现各种有趣的娱乐内容</p>
        </div>
        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="feature-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="navigateTo(feature.path)"
          >
            <div class="feature-icon" :style="{ backgroundColor: `${feature.color}20`, color: feature.color }">
              {{ feature.icon }}
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-arrow">→</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div
            v-for="(stat, index) in stats"
            :key="stat.label"
            class="stat-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">准备好开始了吗？</h2>
          <p class="cta-description">
            立即探索我们的娱乐内容，享受无限乐趣！
          </p>
          <button class="btn btn-primary btn-lg animate-bounce" @click="navigateTo('/games')">
            <span>🚀</span>
            立即开始
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  position: relative;
  padding: 6rem 0 4rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: -1;
}

.hero-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  top: -100px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  bottom: -50px;
  left: -50px;
  animation: float 8s ease-in-out infinite reverse;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  top: 50%;
  left: 30%;
  animation: float 7s ease-in-out infinite;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-brand {
  font-size: 4rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Features Section */
.features {
  padding: 4rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s ease forwards;
  opacity: 0;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.feature-arrow {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-weight: 600;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-arrow {
  background: var(--primary-color);
  color: white;
  transform: translateX(4px);
}

/* Stats Section */
.stats {
  padding: 3rem 0;
  background: var(--bg-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  text-align: center;
  padding: 2rem;
  animation: scaleIn 0.6s ease forwards;
  opacity: 0;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* CTA Section */
.cta {
  padding: 5rem 0;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 4rem 0 3rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-brand {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-title,
  .cta-title {
    font-size: 1.875rem;
  }
}
</style>
