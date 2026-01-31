<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEntertainmentStore } from '../stores/entertainment'

const store = useEntertainmentStore()
const currentJoke = ref(0)
const showPunchline = ref(false)

const jokes = [
  {
    id: 1,
    setup: '为什么程序员总是分不清圣诞节和万圣节？',
    punchline: '因为 Oct 31 == Dec 25！',
    category: '程序员',
    rating: 4.5
  },
  {
    id: 2,
    setup: '一个SQL查询语句走进酒吧，走到两个表中间问：',
    punchline: '"我可以join你们吗？"',
    category: '程序员',
    rating: 4.8
  },
  {
    id: 3,
    setup: '为什么Python程序员戴眼镜？',
    punchline: '因为他们看不清C！',
    category: '程序员',
    rating: 4.2
  },
  {
    id: 4,
    setup: '医生："我有一个好消息和一个坏消息。"',
    punchline: '病人："先听坏消息。"医生："你只剩24小时生命了。"病人："那好消息呢？"医生："我昨天就想告诉你了。"',
    category: '医疗',
    rating: 4.0
  },
  {
    id: 5,
    setup: '老师："小明，请用"如果"造句。"',
    punchline: '小明："汽水不如果汁好喝。"',
    category: '校园',
    rating: 4.3
  },
  {
    id: 6,
    setup: '为什么数学书总是很忧郁？',
    punchline: '因为它有太多问题！',
    category: '数学',
    rating: 3.8
  },
  {
    id: 7,
    setup: '一只蚂蚁迷路了，遇到另一只蚂蚁。它问：',
    punchline: '"你都如何回蚁窝？"另一只蚂蚁愣了一下，然后唱："带着笑或是很沉默？"',
    category: '动物',
    rating: 4.6
  },
  {
    id: 8,
    setup: '为什么程序员不喜欢大自然？',
    punchline: '因为那里有太多的bugs！',
    category: '程序员',
    rating: 4.4
  },
  {
    id: 9,
    setup: '老婆："老公，如果我死了，你会不会再娶？"',
    punchline: '老公："当然不会，我将成为鳏夫。"老婆："那你就是承认想过这个问题了！"',
    category: '家庭',
    rating: 4.1
  },
  {
    id: 10,
    setup: '为什么程序员总是把万圣节和圣诞节搞混？',
    punchline: '因为 31 OCT = 25 DEC！',
    category: '程序员',
    rating: 4.7
  }
]

const categories = computed(() => {
  const cats = [...new Set(jokes.map(j => j.category))]
  return ['全部', ...cats]
})

const selectedCategory = ref('全部')

const filteredJokes = computed(() => {
  if (selectedCategory.value === '全部') return jokes
  return jokes.filter(j => j.category === selectedCategory.value)
})

const nextJoke = () => {
  showPunchline.value = false
  currentJoke.value = (currentJoke.value + 1) % filteredJokes.value.length
}

const prevJoke = () => {
  showPunchline.value = false
  currentJoke.value = (currentJoke.value - 1 + filteredJokes.value.length) % filteredJokes.value.length
}

const revealPunchline = () => {
  showPunchline.value = true
}

const currentJokeData = computed(() => filteredJokes.value[currentJoke.value] || jokes[0])

const copyJoke = () => {
  const joke = currentJokeData.value
  if (joke) {
    const text = `${joke.setup}\n${joke.punchline}`
    navigator.clipboard.writeText(text)
    alert('笑话已复制到剪贴板！')
  }
}
</script>

<template>
  <div class="jokes-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-icon">😄</span>
          开心笑话
        </h1>
        <p class="page-description">每天一个笑话，快乐一整天！</p>
      </div>

      <!-- Category Filter -->
      <div class="category-filter">
        <button
          v-for="cat in categories"
          :key="cat"
          class="category-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat; currentJoke = 0; showPunchline = false"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Joke Card -->
      <div class="joke-container">
        <div class="joke-card" :key="currentJokeData.id">
          <div class="joke-category">
            <span class="category-badge">{{ currentJokeData.category }}</span>
            <div class="joke-rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(currentJokeData.rating) }">★</span>
            </div>
          </div>

          <div class="joke-content">
            <p class="joke-setup">{{ currentJokeData.setup }}</p>
            
            <transition name="fade">
              <p v-if="showPunchline" class="joke-punchline">
                {{ currentJokeData.punchline }}
              </p>
            </transition>

            <button
              v-if="!showPunchline"
              class="reveal-btn"
              @click="revealPunchline"
            >
              <span>🎭</span>
              揭晓答案
            </button>
          </div>

          <div class="joke-actions">
            <button
              class="action-btn"
              :class="{ active: store.isFavorite(currentJokeData.id) }"
              @click="store.toggleFavoriteJoke(currentJokeData.id)"
            >
              <span>{{ store.isFavorite(currentJokeData.id) ? '❤️' : '🤍' }}</span>
              {{ store.isFavorite(currentJokeData.id) ? '已收藏' : '收藏' }}
            </button>
            <button class="action-btn" @click="copyJoke">
              <span>📋</span>
              复制
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="joke-navigation">
          <button class="nav-btn" @click="prevJoke">
            <span>←</span>
            上一个
          </button>
          <span class="joke-counter">
            {{ currentJoke + 1 }} / {{ filteredJokes.length }}
          </span>
          <button class="nav-btn" @click="nextJoke">
            下一个
            <span>→</span>
          </button>
        </div>
      </div>

      <!-- Favorites Section -->
      <div v-if="store.favoriteJokes.length > 0" class="favorites-section">
        <h3 class="favorites-title">
          <span>❤️</span>
          我的收藏 ({{ store.favoritesCount }})
        </h3>
        <div class="favorites-list">
          <div
            v-for="jokeId in store.favoriteJokes"
            :key="jokeId"
            class="favorite-item"
          >
            <p>{{ jokes.find(j => j.id === jokeId)?.setup }}</p>
            <button @click="store.toggleFavoriteJoke(jokeId)">✕</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jokes-page {
  padding: 2rem 0;
  min-height: calc(100vh - 64px);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.title-icon {
  font-size: 2.5rem;
}

.page-description {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

/* Category Filter */
.category-filter {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.category-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

/* Joke Card */
.joke-container {
  max-width: 600px;
  margin: 0 auto;
}

.joke-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  margin-bottom: 1.5rem;
  animation: slideUp 0.5s ease;
}

.joke-category {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.category-badge {
  padding: 0.25rem 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.joke-rating {
  display: flex;
  gap: 0.25rem;
}

.star {
  color: var(--border-color);
  font-size: 1.25rem;
}

.star.filled {
  color: #fbbf24;
}

.joke-content {
  text-align: center;
  margin-bottom: 1.5rem;
}

.joke-setup {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.joke-punchline {
  font-size: 1.125rem;
  color: var(--primary-color);
  font-weight: 500;
  padding: 1rem;
  background: rgba(99, 102, 241, 0.05);
  border-radius: var(--radius);
  border-left: 4px solid var(--primary-color);
  animation: fadeIn 0.3s ease;
}

.reveal-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reveal-btn:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.joke-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn.active {
  background: rgba(236, 72, 153, 0.1);
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

/* Navigation */
.joke-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.joke-counter {
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* Favorites */
.favorites-section {
  max-width: 600px;
  margin: 3rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.favorites-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.favorite-item p {
  flex: 1;
  margin-right: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-item button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.favorite-item button:hover {
  background: var(--danger-color);
  color: white;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.875rem;
  }
  
  .joke-card {
    padding: 1.5rem;
  }
  
  .joke-setup {
    font-size: 1.125rem;
  }
  
  .joke-punchline {
    font-size: 1rem;
  }
}
</style>
