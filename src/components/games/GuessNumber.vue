<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  score: [value: number]
}>()

const targetNumber = ref(Math.floor(Math.random() * 100) + 1)
const guess = ref('')
const attempts = ref(0)
const maxAttempts = 10
const message = ref('猜一个 1-100 之间的数字！')
const gameOver = ref(false)
const won = ref(false)
const guessHistory = ref<number[]>([])

const attemptsLeft = computed(() => maxAttempts - attempts.value)

const makeGuess = () => {
  const num = parseInt(guess.value)
  
  if (isNaN(num) || num < 1 || num > 100) {
    message.value = '请输入 1-100 之间的数字！'
    return
  }
  
  if (guessHistory.value.includes(num)) {
    message.value = '你已经猜过这个数字了！'
    return
  }
  
  attempts.value++
  guessHistory.value.push(num)
  
  if (num === targetNumber.value) {
    won.value = true
    gameOver.value = true
    const score = Math.max(100 - (attempts.value - 1) * 10, 10)
    message.value = `🎉 恭喜你猜对了！答案就是 ${targetNumber.value}！用了 ${attempts.value} 次尝试。获得 ${score} 分！`
    emit('score', score)
  } else if (attempts.value >= maxAttempts) {
    gameOver.value = true
    message.value = `😢 游戏结束！正确答案是 ${targetNumber.value}`
  } else if (num < targetNumber.value) {
    message.value = `📈 ${num} 太小了！还有 ${attemptsLeft.value} 次机会`
  } else {
    message.value = `📉 ${num} 太大了！还有 ${attemptsLeft.value} 次机会`
  }
  
  guess.value = ''
}

const resetGame = () => {
  targetNumber.value = Math.floor(Math.random() * 100) + 1
  guess.value = ''
  attempts.value = 0
  message.value = '猜一个 1-100 之间的数字！'
  gameOver.value = false
  won.value = false
  guessHistory.value = []
}
</script>

<template>
  <div class="guess-number-game">
    <div class="game-header">
      <h3>🔢 猜数字</h3>
      <span class="attempts-badge">剩余次数: {{ attemptsLeft }}</span>
    </div>
    
    <p class="game-message" :class="{ win: won, lose: gameOver && !won }">
      {{ message }}
    </p>
    
    <div v-if="!gameOver" class="game-input">
      <input
        v-model="guess"
        type="number"
        min="1"
        max="100"
        placeholder="输入数字..."
        @keyup.enter="makeGuess"
        class="guess-input"
      />
      <button @click="makeGuess" class="btn btn-primary">猜测</button>
    </div>
    
    <button v-else @click="resetGame" class="btn btn-success">
      再玩一次
    </button>
    
    <div v-if="guessHistory.length > 0" class="guess-history">
      <p>猜测历史：</p>
      <div class="history-tags">
        <span
          v-for="(g, index) in guessHistory"
          :key="index"
          class="history-tag"
          :class="{
            high: g > targetNumber,
            low: g < targetNumber,
            correct: g === targetNumber
          }"
        >
          {{ g }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guess-number-game {
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

.attempts-badge {
  padding: 0.25rem 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.game-message {
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.game-message.win {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.game-message.lose {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.game-input {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.guess-input {
  width: 120px;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
}

.guess-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.guess-history {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.guess-history p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.history-tag {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--bg-tertiary);
}

.history-tag.high {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.history-tag.low {
  background: rgba(59, 130, 246, 0.1);
  color: var(--info-color);
}

.history-tag.correct {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}
</style>
