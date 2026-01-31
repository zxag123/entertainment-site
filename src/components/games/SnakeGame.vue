<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  score: [value: number]
}>()

const GRID_SIZE = 20
const CELL_SIZE = 15
const INITIAL_SPEED = 150

interface Position {
  x: number
  y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const snake = ref<Position[]>([{ x: 10, y: 10 }])
const food = ref<Position>({ x: 15, y: 15 })
const direction = ref<Direction>('RIGHT')
const nextDirection = ref<Direction>('RIGHT')
const gameRunning = ref(false)
const gameOver = ref(false)
const score = ref(0)
const speed = ref(INITIAL_SPEED)

let gameLoop: ReturnType<typeof setInterval> | null = null

const generateFood = () => {
  let newFood: Position
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  } while (snake.value.some(segment => segment.x === newFood.x && segment.y === newFood.y))
  
  food.value = newFood
}

const moveSnake = () => {
  if (!gameRunning.value) return
  
  direction.value = nextDirection.value
  
  const head = { ...snake.value[0] }
  
  switch (direction.value) {
    case 'UP': head.y--; break
    case 'DOWN': head.y++; break
    case 'LEFT': head.x--; break
    case 'RIGHT': head.x++; break
  }
  
  // Check wall collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    endGame()
    return
  }
  
  // Check self collision
  if (snake.value.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame()
    return
  }
  
  snake.value.unshift(head)
  
  // Check food collision
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    speed.value = Math.max(50, speed.value - 2)
    generateFood()
    
    // Restart loop with new speed
    if (gameLoop) {
      clearInterval(gameLoop)
      gameLoop = setInterval(moveSnake, speed.value)
    }
  } else {
    snake.value.pop()
  }
}

const endGame = () => {
  gameRunning.value = false
  gameOver.value = true
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = null
  }
  emit('score', score.value)
}

const startGame = () => {
  snake.value = [{ x: 10, y: 10 }]
  direction.value = 'RIGHT'
  nextDirection.value = 'RIGHT'
  score.value = 0
  speed.value = INITIAL_SPEED
  gameRunning.value = true
  gameOver.value = false
  generateFood()
  
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(moveSnake, speed.value)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!gameRunning.value) {
    if (e.key === ' ' || e.key === 'Enter') {
      if (gameOver.value) {
        startGame()
      }
    }
    return
  }
  
  switch (e.key) {
    case 'ArrowUp':
      if (direction.value !== 'DOWN') nextDirection.value = 'UP'
      break
    case 'ArrowDown':
      if (direction.value !== 'UP') nextDirection.value = 'DOWN'
      break
    case 'ArrowLeft':
      if (direction.value !== 'RIGHT') nextDirection.value = 'LEFT'
      break
    case 'ArrowRight':
      if (direction.value !== 'LEFT') nextDirection.value = 'RIGHT'
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (gameLoop) clearInterval(gameLoop)
})

const changeDirection = (newDirection: Direction) => {
  if (!gameRunning.value) return
  
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
  }
  
  if (direction.value !== opposites[newDirection]) {
    nextDirection.value = newDirection
  }
}
</script>

<template>
  <div class="snake-game">
    <div class="game-header">
      <h3>🐍 贪吃蛇</h3>
      <span class="score">得分: {{ score }}</span>
    </div>
    
    <div class="game-container">
      <div
        class="game-board"
        :style="{
          width: `${GRID_SIZE * CELL_SIZE}px`,
          height: `${GRID_SIZE * CELL_SIZE}px`
        }"
      >
        <!-- Snake -->
        <div
          v-for="(segment, index) in snake"
          :key="index"
          class="snake-segment"
          :class="{ head: index === 0 }"
          :style="{
            left: `${segment.x * CELL_SIZE}px`,
            top: `${segment.y * CELL_SIZE}px`,
            width: `${CELL_SIZE - 1}px`,
            height: `${CELL_SIZE - 1}px`
          }"
        />
        
        <!-- Food -->
        <div
          class="food"
          :style="{
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
            width: `${CELL_SIZE - 1}px`,
            height: `${CELL_SIZE - 1}px`
          }"
        >
          🍎
        </div>
        
        <!-- Game Over Overlay -->
        <div v-if="gameOver" class="game-overlay">
          <p>游戏结束！</p>
          <p>得分: {{ score }}</p>
          <button @click="startGame" class="btn btn-primary">重新开始</button>
        </div>
        
        <!-- Start Overlay -->
        <div v-else-if="!gameRunning" class="game-overlay">
          <p>🐍 贪吃蛇</p>
          <p class="hint">使用方向键或按钮控制</p>
          <button @click="startGame" class="btn btn-primary">开始游戏</button>
        </div>
      </div>
      
      <!-- Mobile Controls -->
      <div class="mobile-controls">
        <button class="control-btn" @click="changeDirection('UP')">⬆️</button>
        <div class="horizontal-controls">
          <button class="control-btn" @click="changeDirection('LEFT')">⬅️</button>
          <button class="control-btn" @click="changeDirection('RIGHT')">➡️</button>
        </div>
        <button class="control-btn" @click="changeDirection('DOWN')">⬇️</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.snake-game {
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

.score {
  padding: 0.25rem 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
  border-radius: var(--radius);
  font-weight: 600;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.game-board {
  position: relative;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  margin: 0 auto;
}

.snake-segment {
  position: absolute;
  background: var(--success-color);
  border-radius: 2px;
  transition: all 0.05s linear;
}

.snake-segment.head {
  background: #059669;
  border-radius: 4px;
}

.food {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  animation: pulse 1s infinite;
}

.game-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  color: white;
}

.game-overlay p {
  margin: 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.game-overlay .hint {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.mobile-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.horizontal-controls {
  display: flex;
  gap: 2rem;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: var(--radius);
  border: none;
  background: var(--bg-tertiary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: var(--border-color);
  transform: scale(1.1);
}

.control-btn:active {
  transform: scale(0.95);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
</style>
