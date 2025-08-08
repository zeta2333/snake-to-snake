<template>
  <div class="snake-game">
    <!-- Game Header -->
    <header class="game-header">
      <div class="header-top">
        <h1 class="game-title">{{ t('game.title') }}</h1>
        <button @click="switchLanguage" class="language-switch">
          {{ t('language.switch') }}
        </button>
      </div>
      <div class="game-stats">
        <div class="stat">
          <span class="stat-label">{{ t('stats.score') }}:</span>
          <span class="stat-value">{{ gameStats.score }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">{{ t('stats.highScore') }}:</span>
          <span class="stat-value">{{ gameStats.highScore }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">{{ t('stats.level') }}:</span>
          <span class="stat-value">{{ gameStats.level }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">{{ t('stats.time') }}:</span>
          <span class="stat-value">{{ formatTime(gameStats.gameTime) }}</span>
        </div>
        <div class="stat sound-control" @click="toggleSound">
          <span class="stat-label">{{ t('stats.sound') }}:</span>
          <span class="stat-value">{{ soundEnabled ? '🔊' : '🔇' }}</span>
        </div>
      </div>
    </header>

    <!-- Game Menu -->
    <div v-if="gameState === GameState.MENU" class="game-menu">
      <h2>{{ t('game.welcome') }}</h2>
      <div class="difficulty-selector">
        <label>{{ t('difficulty.label') }}:</label>
        <select v-model="gameConfig.difficulty" class="difficulty-select">
          <option :value="Difficulty.EASY">{{ t('difficulty.easy') }}</option>
          <option :value="Difficulty.MEDIUM">{{ t('difficulty.medium') }}</option>
          <option :value="Difficulty.HARD">{{ t('difficulty.hard') }}</option>
          <option :value="Difficulty.EXPERT">{{ t('difficulty.expert') }}</option>
        </select>
      </div>
      <button @click="startGame" class="start-button">{{ t('button.startGame') }}</button>
      <div class="controls-info">
        <h3>{{ t('controls.title') }}</h3>
        <div class="control-grid">
          <div class="control-item">
            <span class="control-key">↑ ↓ ← →</span>
            <span class="control-desc">{{ t('controls.move') }}</span>
          </div>
          <div class="control-item">
            <span class="control-key">W(↑) A(←) S(↓) D(→)</span>
            <span class="control-desc">{{ t('controls.move') }}</span>
          </div>
          <div class="control-item">
            <span class="control-key">SPACE</span>
            <span class="control-desc">{{ t('controls.pause') }}</span>
          </div>
          <div class="control-item">
            <span class="control-key">🔊/🔇</span>
            <span class="control-desc">{{ t('stats.sound') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Board -->
    <div v-if="gameState !== GameState.MENU" class="game-container">
      <div class="game-board-wrapper">
        <div
          class="game-board"
          :style="{
            gridTemplateColumns: `repeat(${gameConfig.gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gameConfig.gridSize}, 1fr)`,
            '--grid-size': gameConfig.gridSize
          }"
        >
          <div
            v-for="cell in gridCells"
            :key="`${cell.x}-${cell.y}`"
            class="grid-cell"
            :class="{
              'snake-head': isSnakeHead(cell),
              'snake-body': isSnakeBody(cell),
              'food-normal': isFoodAt(cell) && food.type === FoodType.NORMAL,
              'food-bonus': isFoodAt(cell) && food.type === FoodType.BONUS,
              'food-speed': isFoodAt(cell) && food.type === FoodType.SPEED
            }"
          >
            <span v-if="isSnakeHead(cell)" class="game-icon snake-head-icon">🐍</span>
            <span v-else-if="isFoodAt(cell)" class="game-icon food-icon">
              {{ getFoodIcon(food.type) }}
            </span>
          </div>
        </div>
        <ParticleSystem ref="particleSystemRef" />
      </div>

      <!-- Game Controls -->
      <div class="game-controls">
        <button
          v-if="gameState === GameState.PLAYING"
          @click="pauseGame"
          class="control-button pause-button"
        >
          {{ t('button.pause') }}
        </button>
        <button
          v-if="gameState === GameState.PAUSED"
          @click="resumeGame"
          class="control-button resume-button"
        >
          {{ t('button.resume') }}
        </button>
        <button @click="resetGame" class="control-button reset-button">
          {{ t('button.reset') }}
        </button>
      </div>

      <!-- Mobile Controls -->
      <div class="mobile-controls" v-if="isGameRunning">
        <div class="direction-pad">
          <button @click="changeDirection(Direction.UP)" class="direction-button up">⬆️</button>
          <div class="horizontal-controls">
            <button @click="changeDirection(Direction.LEFT)" class="direction-button left">⬅️</button>
            <button @click="changeDirection(Direction.RIGHT)" class="direction-button right">➡️</button>
          </div>
          <button @click="changeDirection(Direction.DOWN)" class="direction-button down">⬇️</button>
        </div>
      </div>
    </div>

    <!-- Pause Overlay -->
    <div v-if="gameState === GameState.PAUSED" class="game-overlay">
      <div class="overlay-content">
        <h2>{{ t('game.paused') }}</h2>
        <p>{{ t('game.pauseHint') }}</p>
      </div>
    </div>

    <!-- Game Over Overlay -->
    <div v-if="gameState === GameState.GAME_OVER" class="game-overlay">
      <div class="overlay-content">
        <h2>{{ t('game.over') }}</h2>
        <div class="final-stats">
          <p>{{ t('final.score') }}: <strong>{{ gameStats.score }}</strong></p>
          <p>{{ t('final.level') }}: <strong>{{ gameStats.level }}</strong></p>
          <p>{{ t('final.foodEaten') }}: <strong>{{ gameStats.foodEaten }}</strong></p>
          <p>{{ t('final.timePlayed') }}: <strong>{{ formatTime(gameStats.gameTime) }}</strong></p>
          <p v-if="gameStats.score === gameStats.highScore" class="new-record">
            {{ t('final.newRecord') }}
          </p>
        </div>
        <div class="game-over-buttons">
          <button @click="startGame" class="control-button play-again-button">
            {{ t('button.playAgain') }}
          </button>
          <button @click="resetGame" class="control-button menu-button">
            {{ t('button.mainMenu') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Victory Overlay -->
    <div v-if="gameState === GameState.VICTORY" class="game-overlay">
      <div class="overlay-content victory-content">
        <h2>{{ t('game.victory') }}</h2>
        <p class="victory-message">{{ t('game.victoryMessage') }}</p>
        <div class="final-stats">
          <p>{{ t('final.perfectScore') }}: <strong>{{ gameStats.score }}</strong></p>
          <p>{{ t('final.finalLevel') }}: <strong>{{ gameStats.level }}</strong></p>
          <p>{{ t('final.totalFood') }}: <strong>{{ gameStats.foodEaten }}</strong></p>
          <p>{{ t('final.completionTime') }}: <strong>{{ formatTime(gameStats.gameTime) }}</strong></p>
          <p class="new-record">
            {{ t('final.perfectGame') }}
          </p>
        </div>
        <div class="game-over-buttons">
          <button @click="startGame" class="control-button play-again-button">
            {{ t('button.playAgain') }}
          </button>
          <button @click="resetGame" class="control-button menu-button">
            {{ t('button.mainMenu') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSnakeGame } from '@/composables/useSnakeGame'
import { useI18n } from '@/composables/useI18n'
import ParticleSystem from './ParticleSystem.vue'
import type { Position } from '@/types/game'

const {
  gameState,
  gameConfig,
  snake,
  food,
  gameStats,
  gridCells,
  soundEnabled,
  isGameRunning,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  changeDirection,
  toggleSound,
  GameState,
  Direction,
  FoodType,
  Difficulty
} = useSnakeGame()

// 国际化
const { t, switchLanguage, currentLanguage } = useI18n()

// Particle system reference
const particleSystemRef = ref<InstanceType<typeof ParticleSystem> | null>(null)

// Watch for game events to trigger particle effects
watch(() => gameStats.score, (newScore, oldScore) => {
  if (newScore > oldScore && particleSystemRef.value) {
    // Food eaten effect
    const head = snake.body[0]
    if (head) {
      const cellSize = 25 // Approximate cell size
      const x = head.x * cellSize + cellSize / 2
      const y = head.y * cellSize + cellSize / 2
      particleSystemRef.value.createFoodEatEffect(x, y, food.value.type)
    }
  }
})

watch(() => gameStats.level, (newLevel, oldLevel) => {
  if (newLevel > oldLevel && particleSystemRef.value) {
    // Level up effect
    const centerX = 250 // Center of game board
    const centerY = 250
    particleSystemRef.value.createLevelUpEffect(centerX, centerY)
  }
})

// Helper functions
function isSnakeHead(cell: Position): boolean {
  const head = snake.body[0]
  return head && head.x === cell.x && head.y === cell.y
}

function isSnakeBody(cell: Position): boolean {
  return snake.body.slice(1).some(segment => 
    segment.x === cell.x && segment.y === cell.y
  )
}

function isFoodAt(cell: Position): boolean {
  return food.value.position.x === cell.x && food.value.position.y === cell.y
}

function getFoodIcon(type: string): string {
  const icons = {
    [FoodType.NORMAL]: '🍎',
    [FoodType.BONUS]: '🍇',
    [FoodType.SPEED]: '⚡'
  }
  return icons[type as keyof typeof icons] || '🍎'
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.snake-game {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
}

.game-header {
  text-align: center;
  margin-bottom: 20px;
}

.header-top {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.game-title {
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.language-switch {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.language-switch:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.game-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.stat {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.stat-label {
  font-weight: bold;
  margin-right: 5px;
}

.stat-value {
  color: #ffd700;
  font-weight: bold;
}

.sound-control {
  cursor: pointer;
  transition: transform 0.2s;
}

.sound-control:hover {
  transform: scale(1.05);
}

.game-menu {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.difficulty-selector {
  margin: 20px 0;
}

.difficulty-select {
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-left: 10px;
  font-size: 16px;
}

.start-button {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  border-radius: 10px;
  cursor: pointer;
  margin: 20px 0;
  transition: transform 0.2s;
}

.start-button:hover {
  transform: scale(1.05);
}

.controls-info {
  margin-top: 30px;
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 10px;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.control-key {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 8px;
  font-family: monospace;
  font-weight: bold;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.control-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.game-board-wrapper {
  position: relative;
  max-width: 500px;
  aspect-ratio: 1;
  width: 100%;
}

.game-board {
  display: grid;
  gap: 1px;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 10px;
  width: 100%;
  height: 100%;
}

.grid-cell {
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
  aspect-ratio: 1;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  position: relative;
}

.game-icon {
  font-size: clamp(0.8rem, 2vw, 1.2rem);
  line-height: 1;
  display: block;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
}

.snake-head {
  background: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.snake-body {
  background: #8BC34A;
}

.food-normal {
  background: rgba(255, 0, 0, 0.3);
  animation: pulse 1s infinite;
}

.food-bonus {
  background: rgba(255, 215, 0, 0.3);
  animation: pulse 1s infinite;
}

.food-speed {
  background: rgba(0, 191, 255, 0.3);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.game-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.control-button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.pause-button, .resume-button {
  background: linear-gradient(45deg, #FF9800, #F57C00);
  color: white;
}

.reset-button {
  background: linear-gradient(45deg, #f44336, #d32f2f);
  color: white;
}

.play-again-button {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
}

.menu-button {
  background: linear-gradient(45deg, #2196F3, #1976D2);
  color: white;
}

.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.mobile-controls {
  display: none;
}

.direction-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.horizontal-controls {
  display: flex;
  gap: 60px;
}

.direction-button {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.direction-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.game-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.overlay-content {
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  max-width: 400px;
}

.final-stats {
  margin: 20px 0;
}

.final-stats p {
  margin: 10px 0;
}

.new-record {
  color: #ffd700;
  font-size: 1.2rem;
  animation: pulse 1s infinite;
}

.victory-content {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
}

.victory-message {
  font-size: 1.1rem;
  margin: 10px 0 20px 0;
  font-weight: bold;
}

.game-over-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .snake-game {
    padding: 10px;
  }
  
  .header-top {
    flex-direction: column;
    gap: 15px;
  }

  .game-title {
    font-size: 2rem;
  }

  .language-switch {
    font-size: 12px;
    padding: 6px 12px;
  }

  .game-stats {
    gap: 10px;
  }
  
  .stat {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .game-board {
    max-width: 90vw;
  }
  
  .mobile-controls {
    display: block;
    margin-top: 20px;
  }
  
  .overlay-content {
    margin: 20px;
    padding: 30px;
  }
  
  .game-over-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .game-icon {
    font-size: clamp(0.6rem, 3vw, 1rem);
  }

  .direction-button {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .horizontal-controls {
    gap: 40px;
  }
}
</style>
