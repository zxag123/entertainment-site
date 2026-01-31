import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEntertainmentStore = defineStore('entertainment', () => {
  // 状态
  const favoriteJokes = ref<number[]>([])
  const gameScores = ref<Record<string, number>>({})
  const currentTheme = ref('light')

  // Getters
  const favoritesCount = computed(() => favoriteJokes.value.length)
  const totalScore = computed(() => {
    return Object.values(gameScores.value).reduce((sum, score) => sum + score, 0)
  })

  // Actions
  const toggleFavoriteJoke = (id: number) => {
    const index = favoriteJokes.value.indexOf(id)
    if (index > -1) {
      favoriteJokes.value.splice(index, 1)
    } else {
      favoriteJokes.value.push(id)
    }
  }

  const isFavorite = (id: number) => favoriteJokes.value.includes(id)

  const updateGameScore = (gameName: string, score: number) => {
    const currentScore = gameScores.value[gameName] || 0
    if (score > currentScore) {
      gameScores.value[gameName] = score
    }
  }

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  }

  return {
    favoriteJokes,
    gameScores,
    currentTheme,
    favoritesCount,
    totalScore,
    toggleFavoriteJoke,
    isFavorite,
    updateGameScore,
    toggleTheme
  }
})
