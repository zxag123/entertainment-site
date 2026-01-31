<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEntertainmentStore } from '../stores/entertainment'
import GuessNumber from '../components/games/GuessNumber.vue'
import TicTacToe from '../components/games/TicTacToe.vue'
import MemoryGame from '../components/games/MemoryGame.vue'
import SnakeGame from '../components/games/SnakeGame.vue'

const store = useEntertainmentStore()
const activeGame = ref<string | null>(null)

const games = [
  {
    id: 'guess-number',
    name: '猜数字',
    description: '猜一个1-100之间的数字',
    icon: '🔢',
    color: '#6366f1',
    difficulty: '简单',
    component: GuessNumber
  },
  {
    id: 'tic-tac-toe',
    name: '井字棋',
    description: '经典的三连棋游戏',
    icon: '⭕',
    color: '#ec4899',
    difficulty: '中等',
    component: TicTacToe
  },
  {
    id: 'memory',
    name: '记忆翻牌',
    description: '考验你的记忆力',
    icon: '🧠',
    color: '#f59e0b',
    difficulty: '中等',
    component: MemoryGame
  },
  {
    id: 'snake',
    name: '贪吃蛇',
    description: '经典的贪吃蛇游戏',
    icon: '🐍',
    color: '#10b981',
    difficulty: '困难',
    component: SnakeGame
  }
]

const currentGameComponent = computed(() => {
  const game = games.find(g => g.id === activeGame.value)
  return game?.component || null
})

const startGame = (gameId: string) => {
  activeGame.value = gameId
}

const closeGame = () => {
  activeGame.value = null
}

const onGameScore = (gameId: string, score: number) => {
  store.updateGameScore(gameId, score)
}
</script>

<template>
  <div class="games-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-icon">🎮</span>
          趣味游戏
        </h1>
        <p class="page-description">选择你喜欢的游戏，开始挑战吧！</p>
      </div>

      <!-- Game Modal -->
      <div v-if="activeGame" class="game-modal" @click.self="closeGame">
        <div class="game-modal-content">
          <div class="game-modal-header">
            <h3>{{ games.find(g => g.id === activeGame)?.name }}</h3>
            <button class="close-btn" @click="closeGame">✕</button>
          </div>
          <div class="game-modal-body">
            <component
              :is="currentGameComponent"
              @score="(score: number) => onGameScore(activeGame!, score)"
            />
          </div>
        </div>
      </div>

      <!-- Games Grid -->
      <div v-else class="games-grid">
        <div
          v-for="(game, index) in games"
          :key="game.id"
          class="game-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="startGame(game.id)"
        >
          <div class="game-icon" :style="{ backgroundColor: `${game.color}20`, color: game.color }">
            {{ game.icon }}
          </div>
          <div class="game-info">
            <h3 class="game-name">{{ game.name }}</h3>
            <p class="game-description">{{ game.description }}</p>
            <div class="game-meta">
              <span class="difficulty-badge" :style="{ backgroundColor: `${game.color}20`, color: game.color }">
                {{ game.difficulty }}
              </span>
              <span v-if="store.gameScores[game.id]" class="score-badge">
                最高分: {{ store.gameScores[game.id] }}
              </span>
            </div>
          </div>
          <button class="play-btn" :style="{ backgroundColor: game.color }">
            开始游戏
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div v-if="!activeGame" class="games-stats">
        <div class="stat-box">
          <span class="stat-icon">🏆</span>
          <div class="stat-info">
            <span class="stat-value">{{ store.totalScore }}</span>
            <span class="stat-label">总得分</span>
          </div>
        </div>
        <div class="stat-box">
          <span class="stat-icon">🎯</span>
          <div class="stat-info">
            <span class="stat-value">{{ Object.keys(store.gameScores).length }}</span>
            <span class="stat-label">已玩游戏</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.games-page {
  padding: 2rem 0;
  min-height: calc(100vh - 64px);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
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

/* Game Modal */
.game-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.game-modal-content {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  animation: scaleIn 0.3s ease;
}

.game-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.game-modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--bg-tertiary);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--danger-color);
  color: white;
}

.game-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

/* Games Grid */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.game-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideUp 0.6s ease forwards;
  opacity: 0;
  display: flex;
  flex-direction: column;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.game-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.game-info {
  flex: 1;
}

.game-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.game-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.game-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.difficulty-badge,
.score-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.score-badge {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.play-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: var(--radius);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

/* Stats */
.games-stats {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-primary);
  padding: 1.5rem 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.875rem;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
  }
  
  .game-modal-content {
    max-width: 100%;
    margin: 1rem;
  }
}
</style>
