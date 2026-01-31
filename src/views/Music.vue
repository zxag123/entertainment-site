<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Track {
  id: number
  title: string
  artist: string
  duration: number
  emoji: string
  color: string
  src: string
}

const tracks: Track[] = [
  { 
    id: 1, 
    title: '我要夏天', 
    artist: '周杰伦 / 杨瑞代', 
    duration: 215, 
    emoji: '🏖️', 
    color: '#f59e0b',
    src: '/music/周杰伦 杨瑞代 - 我要夏天.mp3'
  },
  { 
    id: 2, 
    title: '夜曲', 
    artist: '周杰伦', 
    duration: 226, 
    emoji: '🌙', 
    color: '#6366f1',
    src: '/music/周杰伦 - 夜曲.mp3'
  },
  { 
    id: 3, 
    title: '七里香', 
    artist: '周杰伦', 
    duration: 299, 
    emoji: '🌸', 
    color: '#ec4899',
    src: '/music/周杰伦 - 七里香.mp3'
  }
]

const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const volume = ref(70)
const isMuted = ref(false)
const playMode = ref<'list' | 'random' | 'single'>('list')
const actualDuration = ref(0)

// 音频元素
const audioRef = ref<HTMLAudioElement | null>(null)

const currentTrack = computed(() => tracks[currentTrackIndex.value] || tracks[0])

const trackDuration = computed(() => {
  return actualDuration.value || currentTrack.value?.duration || 0
})

const progressPercent = computed(() => {
  const duration = trackDuration.value
  if (!duration) return 0
  return (currentTime.value / duration) * 100
})

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 初始化音频
const initAudio = () => {
  if (!audioRef.value) {
    audioRef.value = new Audio()
    audioRef.value.addEventListener('timeupdate', () => {
      if (audioRef.value) {
        currentTime.value = audioRef.value.currentTime
      }
    })
    audioRef.value.addEventListener('ended', () => {
      nextTrack()
    })
    audioRef.value.addEventListener('loadedmetadata', () => {
      const audio = audioRef.value
      if (audio && audio.duration) {
        actualDuration.value = audio.duration
      }
    })
  }
}

// 加载当前曲目
const loadTrack = () => {
  initAudio()
  if (audioRef.value) {
    audioRef.value.src = currentTrack.value.src
    audioRef.value.volume = volume.value / 100
    audioRef.value.currentTime = 0
    currentTime.value = 0
  }
}

const togglePlay = () => {
  initAudio()
  if (!audioRef.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    // 如果当前没有加载音频，先加载
    if (!audioRef.value.src) {
      loadTrack()
    }
    audioRef.value.play().then(() => {
      isPlaying.value = true
    }).catch(err => {
      console.error('播放失败:', err)
      alert('音频播放失败，请检查文件是否存在')
    })
  }
}

const nextTrack = () => {
  if (playMode.value === 'random') {
    currentTrackIndex.value = Math.floor(Math.random() * tracks.length)
  } else {
    currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length
  }
  loadTrack()
  if (isPlaying.value) {
    audioRef.value?.play()
  }
}

const prevTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.length) % tracks.length
  loadTrack()
  if (isPlaying.value) {
    audioRef.value?.play()
  }
}

const selectTrack = (index: number) => {
  currentTrackIndex.value = index
  loadTrack()
  audioRef.value?.play().then(() => {
    isPlaying.value = true
  })
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (audioRef.value) {
    audioRef.value.muted = isMuted.value
  }
}

const cyclePlayMode = () => {
  const modes: ('list' | 'random' | 'single')[] = ['list', 'random', 'single']
  const currentIndex = modes.indexOf(playMode.value)
  const nextMode = modes[(currentIndex + 1) % modes.length]
  if (nextMode) {
    playMode.value = nextMode
  }
}

const playModeIcon = computed(() => {
  switch (playMode.value) {
    case 'list': return '🔁'
    case 'random': return '🔀'
    case 'single': return '🔂'
  }
})

// 处理进度条点击
const handleProgressClick = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  const newTime = percent * trackDuration.value
  currentTime.value = newTime
  const audio = audioRef.value
  if (audio) {
    audio.currentTime = newTime
  }
}

// 监听音量变化
watch(volume, (newVal) => {
  if (audioRef.value) {
    audioRef.value.volume = newVal / 100
  }
})

// 监听静音变化
watch(isMuted, (newVal) => {
  if (audioRef.value) {
    audioRef.value.muted = newVal
  }
})

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value = null
  }
})
</script>

<template>
  <div class="music-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-icon">🎵</span>
          音乐放松
        </h1>
        <p class="page-description">精选音乐，放松心情，享受生活</p>
      </div>

      <!-- Player Card -->
      <div class="player-card">
        <!-- Album Art -->
        <div class="album-art" :style="{ backgroundColor: `${currentTrack.color}20` }">
          <div class="album-emoji" :class="{ playing: isPlaying }">
            {{ currentTrack.emoji }}
          </div>
          <div class="vinyl-record" :class="{ spinning: isPlaying }">
            <div class="vinyl-center"></div>
          </div>
        </div>

        <!-- Track Info -->
        <div class="track-info">
          <h3 class="track-title">{{ currentTrack.title }}</h3>
          <p class="track-artist">{{ currentTrack.artist }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="progress-section">
          <div class="progress-bar" @click="handleProgressClick">
            <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
            <div class="progress-handle" :style="{ left: `${progressPercent}%` }"></div>
          </div>
          <div class="time-display">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(trackDuration) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="controls">
          <button class="control-btn mode-btn" @click="cyclePlayMode" :title="playMode">
            {{ playModeIcon }}
          </button>
          
          <button class="control-btn" @click="prevTrack">
            ⏮️
          </button>
          
          <button class="play-btn" @click="togglePlay">
            <span v-if="isPlaying">⏸️</span>
            <span v-else>▶️</span>
          </button>
          
          <button class="control-btn" @click="nextTrack">
            ⏭️
          </button>
          
          <button class="control-btn" @click="toggleMute">
            {{ isMuted ? '🔇' : '🔊' }}
          </button>
        </div>

        <!-- Volume -->
        <div class="volume-section">
          <span>🔈</span>
          <input
            type="range"
            min="0"
            max="100"
            v-model="volume"
            class="volume-slider"
          />
          <span>{{ volume }}%</span>
        </div>
      </div>

      <!-- Playlist -->
      <div class="playlist-section">
        <h3 class="playlist-title">播放列表</h3>
        <div class="playlist">
          <div
            v-for="(track, index) in tracks"
            :key="track.id"
            class="playlist-item"
            :class="{ active: index === currentTrackIndex, playing: index === currentTrackIndex && isPlaying }"
            @click="selectTrack(index)"
          >
            <div class="track-number">
              <span v-if="index === currentTrackIndex && isPlaying" class="playing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="track-emoji">{{ track.emoji }}</div>
            <div class="track-details">
              <span class="track-name">{{ track.title }}</span>
              <span class="track-meta">{{ track.artist }}</span>
            </div>
            <span class="track-duration">{{ formatTime(track.duration) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.music-page {
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

/* Player Card */
.player-card {
  max-width: 500px;
  margin: 0 auto 3rem;
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.album-art {
  width: 200px;
  height: 200px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.album-emoji {
  font-size: 6rem;
  z-index: 2;
  animation: float 3s ease-in-out infinite;
}

.vinyl-record {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(45deg, #1a1a1a, #333, #1a1a1a);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vinyl-record.spinning {
  animation: spin 2s linear infinite;
}

.vinyl-center {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--bg-primary);
}

.track-info {
  text-align: center;
  margin-bottom: 1.5rem;
}

.track-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.track-artist {
  color: var(--text-secondary);
}

/* Progress */
.progress-section {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 3px;
  transition: width 0.1s linear;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: var(--primary-color);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Controls */
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--bg-tertiary);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: var(--border-color);
  transform: scale(1.1);
}

.play-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

/* Volume */
.volume-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
}

.volume-slider {
  width: 150px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--bg-tertiary);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
}

/* Playlist */
.playlist-section {
  max-width: 600px;
  margin: 0 auto;
}

.playlist-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.playlist {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--border-color);
}

.playlist-item:last-child {
  border-bottom: none;
}

.playlist-item:hover {
  background: var(--bg-tertiary);
}

.playlist-item.active {
  background: rgba(99, 102, 241, 0.1);
}

.track-number {
  width: 24px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.playing-indicator {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
}

.playing-indicator span {
  width: 3px;
  background: var(--primary-color);
  border-radius: 2px;
  animation: sound-wave 0.5s ease-in-out infinite alternate;
}

.playing-indicator span:nth-child(1) { height: 8px; animation-delay: 0s; }
.playing-indicator span:nth-child(2) { height: 16px; animation-delay: 0.1s; }
.playing-indicator span:nth-child(3) { height: 12px; animation-delay: 0.2s; }

@keyframes sound-wave {
  from { transform: scaleY(0.3); }
  to { transform: scaleY(1); }
}

.track-emoji {
  font-size: 1.5rem;
}

.track-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.track-name {
  font-weight: 500;
}

.track-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.track-duration {
  font-size: 0.875rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.875rem;
  }
  
  .player-card {
    padding: 1.5rem;
  }
  
  .album-art {
    width: 150px;
    height: 150px;
  }
  
  .album-emoji {
    font-size: 4rem;
  }
}
</style>
