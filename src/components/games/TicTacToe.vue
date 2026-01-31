<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  score: [value: number]
}>()

type Player = 'X' | 'O' | null

const board = ref<Player[]>(Array(9).fill(null))
const currentPlayer = ref<'X' | 'O'>('X')
const winner = ref<Player>(null)
const gameOver = ref(false)
const winningLine = ref<number[]>([])

const xScore = ref(0)
const oScore = ref(0)
const draws = ref(0)

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖
  [0, 4, 8], [2, 4, 6] // 斜
]

const checkWinner = () => {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination as [number, number, number]
    const va = board.value[a]
    const vb = board.value[b]
    const vc = board.value[c]
    if (va && va === vb && va === vc) {
      winner.value = va
      winningLine.value = combination
      gameOver.value = true
      if (winner.value === 'X') {
        xScore.value++
        emit('score', 10)
      } else {
        oScore.value++
      }
      return
    }
  }

  if (!board.value.includes(null)) {
    gameOver.value = true
    draws.value++
  }
}

const makeMove = (index: number) => {
  if (board.value[index] || gameOver.value) return
  
  board.value[index] = currentPlayer.value
  checkWinner()
  
  if (!gameOver.value) {
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
  }
}

const resetGame = () => {
  board.value = Array(9).fill(null)
  currentPlayer.value = 'X'
  winner.value = null
  gameOver.value = false
  winningLine.value = []
}

const resetScores = () => {
  xScore.value = 0
  oScore.value = 0
  draws.value = 0
  resetGame()
}

const statusMessage = computed(() => {
  if (winner.value) {
    return `🎉 ${winner.value} 获胜！`
  } else if (gameOver.value) {
    return '🤝 平局！'
  }
  return `当前玩家: ${currentPlayer.value}`
})
</script>

<template>
  <div class="tic-tac-toe-game">
    <div class="game-header">
      <h3>⭕ 井字棋</h3>
      <div class="score-board">
        <span class="score x">X: {{ xScore }}</span>
        <span class="score draw">平局: {{ draws }}</span>
        <span class="score o">O: {{ oScore }}</span>
      </div>
    </div>
    
    <p class="status-message" :class="{ win: winner, draw: gameOver && !winner }">
      {{ statusMessage }}
    </p>
    
    <div class="game-board">
      <div
        v-for="(cell, index) in board"
        :key="index"
        class="cell"
        :class="{
          'cell-x': cell === 'X',
          'cell-o': cell === 'O',
          'winning': winningLine.includes(index),
          'disabled': gameOver
        }"
        @click="makeMove(index)"
      >
        {{ cell }}
      </div>
    </div>
    
    <div class="game-actions">
      <button @click="resetGame" class="btn btn-primary">
        重新开始
      </button>
      <button @click="resetScores" class="btn btn-secondary">
        重置分数
      </button>
    </div>
  </div>
</template>

<style scoped>
.tic-tac-toe-game {
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

.score-board {
  display: flex;
  gap: 1rem;
}

.score {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
}

.score.x {
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
}

.score.o {
  background: rgba(236, 72, 153, 0.1);
  color: var(--secondary-color);
}

.score.draw {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.status-message {
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  margin-bottom: 1rem;
  font-weight: 500;
}

.status-message.win {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status-message.draw {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.game-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  max-width: 300px;
  margin: 0 auto 1.5rem;
}

.cell {
  aspect-ratio: 1;
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cell:hover:not(.disabled) {
  background: var(--border-color);
}

.cell-x {
  color: var(--primary-color);
}

.cell-o {
  color: var(--secondary-color);
}

.cell.winning {
  background: rgba(16, 185, 129, 0.2);
  animation: pulse 0.5s ease infinite alternate;
}

.cell.disabled {
  cursor: not-allowed;
}

.game-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}
</style>
