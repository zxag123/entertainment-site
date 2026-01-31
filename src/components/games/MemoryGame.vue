<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits<{
  score: [value: number]
}>()

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']

const cards = ref<Card[]>([])
const flippedCards = ref<number[]>([])
const moves = ref(0)
const matches = ref(0)
const gameComplete = ref(false)
const isLocked = ref(false)

const initGame = () => {
  const shuffled = [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }))
  
  cards.value = shuffled
  flippedCards.value = []
  moves.value = 0
  matches.value = 0
  gameComplete.value = false
  isLocked.value = false
}

const flipCard = (index: number) => {
  if (isLocked.value) return
  if (cards.value[index].isFlipped || cards.value[index].isMatched) return
  if (flippedCards.value.length >= 2) return
  
  cards.value[index].isFlipped = true
  flippedCards.value.push(index)
  
  if (flippedCards.value.length === 2) {
    moves.value++
    checkMatch()
  }
}

const checkMatch = () => {
  isLocked.value = true
  const [first, second] = flippedCards.value
  
  if (cards.value[first].emoji === cards.value[second].emoji) {
    setTimeout(() => {
      cards.value[first].isMatched = true
      cards.value[second].isMatched = true
      matches.value++
      flippedCards.value = []
      isLocked.value = false
      
      if (matches.value === emojis.length) {
        gameComplete.value = true
        const score = Math.max(100 - moves.value * 2, 10)
        emit('score', score)
      }
    }, 500)
  } else {
    setTimeout(() => {
      cards.value[first].isFlipped = false
      cards.value[second].isFlipped = false
      flippedCards.value = []
      isLocked.value = false
    }, 1000)
  }
}

onMounted(() => {
  initGame()
})
</script>

<template>
  <div class="memory-game">
    <div class="game-header">
      <h3>🧠 记忆翻牌</h3>
      <div class="game-stats">
        <span class="stat">步数: {{ moves }}</span>
        <span class="stat">配对: {{ matches }}/{{ emojis.length }}</span>
      </div>
    </div>
    
    <div v-if="gameComplete" class="game-complete">
      <p>🎉 恭喜完成！</p>
      <p>用了 {{ moves }} 步</p>
    </div>
    
    <div class="memory-grid">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="memory-card"
        :class="{
          flipped: card.isFlipped || card.isMatched,
          matched: card.isMatched
        }"
        @click="flipCard(index)"
      >
        <div class="card-inner">
          <div class="card-front">?</div>
          <div class="card-back">{{ card.emoji }}</div>
        </div>
      </div>
    </div>
    
    <button @click="initGame" class="btn btn-primary">
      {{ gameComplete ? '再玩一次' : '重新开始' }}
    </button>
  </div>
</template>

<style scoped>
.memory-game {
  text-align: center;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-header h3 {
  margin: 0;
}

.game-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  padding: 0.25rem 0.75rem;
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  font-size: 0.875rem;
}

.game-complete {
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: var(--radius);
  margin-bottom: 1rem;
}

.game-complete p {
  margin: 0;
  color: var(--success-color);
  font-weight: 600;
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  max-width: 320px;
  margin: 0 auto 1.5rem;
}

.memory-card {
  aspect-ratio: 1;
  cursor: pointer;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.memory-card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.card-front {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.card-back {
  background: var(--bg-tertiary);
  transform: rotateY(180deg);
  font-size: 2rem;
}

.memory-card.matched .card-back {
  background: rgba(16, 185, 129, 0.2);
  animation: match-pulse 0.5s ease;
}

@keyframes match-pulse {
  0%, 100% { transform: rotateY(180deg) scale(1); }
  50% { transform: rotateY(180deg) scale(1.1); }
}
</style>
