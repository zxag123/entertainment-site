<script setup lang="ts">
import { ref, computed } from 'vue'

// 当前激活的工具
const activeTool = ref<string | null>(null)

// 工具列表
const tools = [
  {
    id: 'calculator',
    name: '计算器',
    description: '简单易用的计算器',
    icon: '🧮',
    color: '#6366f1'
  },
  {
    id: 'random',
    name: '随机数生成器',
    description: '生成指定范围的随机数',
    icon: '🎲',
    color: '#ec4899'
  },
  {
    id: 'countdown',
    name: '倒计时器',
    description: '设置倒计时提醒',
    icon: '⏱️',
    color: '#f59e0b'
  },
  {
    id: 'password',
    name: '密码生成器',
    description: '生成安全随机密码',
    icon: '🔐',
    color: '#10b981'
  }
]

// 计算器
const calcDisplay = ref('0')
const calcPrev = ref('')
const calcOperator = ref('')
const calcNewNumber = ref(true)

const calcInput = (val: string) => {
  if (calcNewNumber.value) {
    calcDisplay.value = val
    calcNewNumber.value = false
  } else {
    calcDisplay.value = calcDisplay.value === '0' ? val : calcDisplay.value + val
  }
}

const calcOperatorClick = (op: string) => {
  calcPrev.value = calcDisplay.value
  calcOperator.value = op
  calcNewNumber.value = true
}

const calcEqual = () => {
  const prev = parseFloat(calcPrev.value)
  const current = parseFloat(calcDisplay.value)
  let result = 0

  switch (calcOperator.value) {
    case '+': result = prev + current; break
    case '-': result = prev - current; break
    case '*': result = prev * current; break
    case '/': result = prev / current; break
  }

  calcDisplay.value = String(Math.round(result * 100) / 100)
  calcOperator.value = ''
  calcNewNumber.value = true
}

const calcClear = () => {
  calcDisplay.value = '0'
  calcPrev.value = ''
  calcOperator.value = ''
  calcNewNumber.value = true
}

// 随机数生成器
const randomMin = ref(1)
const randomMax = ref(100)
const randomResult = ref<number | null>(null)

const generateRandom = () => {
  const min = Math.min(randomMin.value, randomMax.value)
  const max = Math.max(randomMin.value, randomMax.value)
  randomResult.value = Math.floor(Math.random() * (max - min + 1)) + min
}

// 倒计时器
const countdownMinutes = ref(5)
const countdownSeconds = ref(0)
const countdownTime = ref(0)
const countdownRunning = ref(false)
let countdownInterval: ReturnType<typeof setInterval> | null = null

const countdownDisplay = computed(() => {
  const mins = Math.floor(countdownTime.value / 60)
  const secs = countdownTime.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const startCountdown = () => {
  if (!countdownRunning.value) {
    countdownTime.value = countdownMinutes.value * 60 + countdownSeconds.value
    countdownRunning.value = true
    countdownInterval = setInterval(() => {
      if (countdownTime.value > 0) {
        countdownTime.value--
      } else {
        stopCountdown()
        alert('⏰ 时间到！')
      }
    }, 1000)
  }
}

const stopCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  countdownRunning.value = false
}

const resetCountdown = () => {
  stopCountdown()
  countdownTime.value = 0
}

// 密码生成器
const passwordLength = ref(12)
const useUppercase = ref(true)
const useLowercase = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(true)
const generatedPassword = ref('')

const generatePassword = () => {
  let chars = ''
  if (useUppercase.value) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (useLowercase.value) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (useNumbers.value) chars += '0123456789'
  if (useSymbols.value) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (chars === '') {
    generatedPassword.value = '请至少选择一种字符类型'
    return
  }

  let password = ''
  for (let i = 0; i < passwordLength.value; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  generatedPassword.value = password
}

const copyPassword = () => {
  if (generatedPassword.value && !generatedPassword.value.includes('请')) {
    navigator.clipboard.writeText(generatedPassword.value)
    alert('密码已复制到剪贴板！')
  }
}
</script>

<template>
  <div class="tools-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-icon">🛠️</span>
          实用工具
        </h1>
        <p class="page-description">各种实用小工具，方便你的生活</p>
      </div>

      <!-- Tools Grid -->
      <div v-if="!activeTool" class="tools-grid">
        <div
          v-for="(tool, index) in tools"
          :key="tool.id"
          class="tool-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="activeTool = tool.id"
        >
          <div class="tool-icon" :style="{ backgroundColor: `${tool.color}20`, color: tool.color }">
            {{ tool.icon }}
          </div>
          <h3 class="tool-name">{{ tool.name }}</h3>
          <p class="tool-description">{{ tool.description }}</p>
        </div>
      </div>

      <!-- Tool Content -->
      <div v-else class="tool-content">
        <button class="back-btn" @click="activeTool = null">
          ← 返回工具列表
        </button>

        <!-- Calculator -->
        <div v-if="activeTool === 'calculator'" class="calculator-tool">
          <h2>🧮 计算器</h2>
          <div class="calculator">
            <div class="calc-display">{{ calcDisplay }}</div>
            <div class="calc-buttons">
              <button @click="calcClear" class="calc-btn clear">C</button>
              <button @click="calcOperatorClick('/')" class="calc-btn operator">÷</button>
              <button @click="calcOperatorClick('*')" class="calc-btn operator">×</button>
              <button @click="calcOperatorClick('-')" class="calc-btn operator">−</button>
              
              <button @click="calcInput('7')" class="calc-btn">7</button>
              <button @click="calcInput('8')" class="calc-btn">8</button>
              <button @click="calcInput('9')" class="calc-btn">9</button>
              <button @click="calcOperatorClick('+')" class="calc-btn operator">+</button>
              
              <button @click="calcInput('4')" class="calc-btn">4</button>
              <button @click="calcInput('5')" class="calc-btn">5</button>
              <button @click="calcInput('6')" class="calc-btn">6</button>
              <button @click="calcEqual" class="calc-btn equals">=</button>
              
              <button @click="calcInput('1')" class="calc-btn">1</button>
              <button @click="calcInput('2')" class="calc-btn">2</button>
              <button @click="calcInput('3')" class="calc-btn">3</button>
              <button @click="calcInput('0')" class="calc-btn zero">0</button>
              <button @click="calcInput('.')" class="calc-btn">.</button>
            </div>
          </div>
        </div>

        <!-- Random Number Generator -->
        <div v-if="activeTool === 'random'" class="random-tool">
          <h2>🎲 随机数生成器</h2>
          <div class="random-generator">
            <div class="input-group">
              <label>最小值</label>
              <input type="number" v-model="randomMin" class="input" />
            </div>
            <div class="input-group">
              <label>最大值</label>
              <input type="number" v-model="randomMax" class="input" />
            </div>
            <button class="btn btn-primary btn-lg" @click="generateRandom">
              生成随机数
            </button>
            <div v-if="randomResult !== null" class="random-result">
              <span class="result-number">{{ randomResult }}</span>
            </div>
          </div>
        </div>

        <!-- Countdown Timer -->
        <div v-if="activeTool === 'countdown'" class="countdown-tool">
          <h2>⏱️ 倒计时器</h2>
          <div class="countdown-timer">
            <div v-if="!countdownRunning && countdownTime === 0" class="countdown-setup">
              <div class="input-group">
                <label>分钟</label>
                <input type="number" v-model="countdownMinutes" min="0" max="99" class="input" />
              </div>
              <div class="input-group">
                <label>秒钟</label>
                <input type="number" v-model="countdownSeconds" min="0" max="59" class="input" />
              </div>
            </div>
            <div class="countdown-display" :class="{ running: countdownRunning }">
              {{ countdownDisplay }}
            </div>
            <div class="countdown-controls">
              <button
                v-if="!countdownRunning"
                class="btn btn-primary"
                @click="startCountdown"
              >
                开始
              </button>
              <button
                v-else
                class="btn btn-danger"
                @click="stopCountdown"
              >
                停止
              </button>
              <button class="btn btn-secondary" @click="resetCountdown">
                重置
              </button>
            </div>
          </div>
        </div>

        <!-- Password Generator -->
        <div v-if="activeTool === 'password'" class="password-tool">
          <h2>🔐 密码生成器</h2>
          <div class="password-generator">
            <div class="password-options">
              <div class="option-row">
                <label>密码长度: {{ passwordLength }}</label>
                <input
                  type="range"
                  min="4"
                  max="32"
                  v-model="passwordLength"
                  class="slider"
                />
              </div>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="useUppercase" />
                  <span>大写字母 (A-Z)</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="useLowercase" />
                  <span>小写字母 (a-z)</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="useNumbers" />
                  <span>数字 (0-9)</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="useSymbols" />
                  <span>特殊符号 (!@#$...)</span>
                </label>
              </div>
            </div>
            <button class="btn btn-primary btn-lg" @click="generatePassword">
              生成密码
            </button>
            <div v-if="generatedPassword" class="password-result">
              <input type="text" :value="generatedPassword" readonly class="password-input" />
              <button class="btn btn-secondary" @click="copyPassword">
                复制
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tools-page {
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

/* Tools Grid */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideUp 0.6s ease forwards;
  opacity: 0;
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.tool-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1rem;
}

.tool-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.tool-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Tool Content */
.tool-content {
  max-width: 600px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--border-color);
}

.tool-content h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Calculator */
.calculator {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
}

.calc-display {
  background: var(--bg-tertiary);
  padding: 1rem;
  border-radius: var(--radius);
  font-size: 2rem;
  text-align: right;
  margin-bottom: 1rem;
  font-weight: 600;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.calc-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.calc-btn {
  padding: 1rem;
  font-size: 1.25rem;
  border: none;
  border-radius: var(--radius);
  background: var(--bg-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.calc-btn:hover {
  background: var(--border-color);
}

.calc-btn.operator {
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
}

.calc-btn.equals {
  background: var(--primary-color);
  color: white;
  grid-row: span 2;
}

.calc-btn.clear {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.calc-btn.zero {
  grid-column: span 2;
}

/* Random Generator */
.random-generator {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.random-result {
  margin-top: 2rem;
  padding: 2rem;
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
}

.result-number {
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Countdown */
.countdown-timer {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.countdown-setup {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.countdown-display {
  font-size: 5rem;
  font-weight: 800;
  font-family: 'Courier New', monospace;
  color: var(--text-primary);
  margin: 1.5rem 0;
  transition: all 0.3s ease;
}

.countdown-display.running {
  color: var(--primary-color);
  animation: pulse 1s infinite;
}

.countdown-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Password Generator */
.password-generator {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.password-options {
  margin-bottom: 1.5rem;
}

.option-row {
  margin-bottom: 1rem;
}

.option-row label {
  display: block;
  margin-bottom: 0.5rem;
}

.slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--bg-tertiary);
  border-radius: 3px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
}

.password-result {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.password-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--bg-tertiary);
  font-family: 'Courier New', monospace;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.875rem;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .countdown-display {
    font-size: 3rem;
  }
  
  .calc-buttons {
    gap: 0.5rem;
  }
  
  .calc-btn {
    padding: 0.75rem;
    font-size: 1rem;
  }
}
</style>
