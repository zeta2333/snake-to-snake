import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import type {
  Position,
  Snake,
  Food,
  GameStats,
  GameConfig
} from '@/types/game'
import {
  Direction,
  FoodType,
  GameState,
  Difficulty
} from '@/types/game'
import { useSoundEffects } from './useSoundEffects'

export function useSnakeGame() {
  // Sound effects
  const {
    soundEnabled,
    playEatSound,
    playBonusSound,
    playSpeedSound,
    playGameOverSound,
    playLevelUpSound,
    playPauseSound,
    playResumeSound,
    toggleSound
  } = useSoundEffects()

  // Game state
  const gameState = ref<GameState>(GameState.MENU)
  const gameConfig = reactive<GameConfig>({
    gridSize: 20,
    initialSpeed: 150,
    difficulty: Difficulty.MEDIUM
  })

  // Game entities
  const snake = reactive<Snake>({
    body: [{ x: 10, y: 10 }],
    direction: Direction.RIGHT
  })

  const food = ref<Food>({
    position: { x: 15, y: 15 },
    type: FoodType.NORMAL,
    points: 10
  })

  // Game stats
  const gameStats = reactive<GameStats>({
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    level: 1,
    foodEaten: 0,
    gameTime: 0
  })

  // Game timing
  let gameLoop: number | null = null
  let gameTimer: number | null = null
  const currentSpeed = ref(gameConfig.initialSpeed)

  // Computed properties
  const gridCells = computed(() => {
    const cells: Position[] = []
    // Generate cells in row-major order to match CSS Grid layout
    for (let y = 0; y < gameConfig.gridSize; y++) {
      for (let x = 0; x < gameConfig.gridSize; x++) {
        cells.push({ x, y })
      }
    }
    return cells
  })

  const isGameRunning = computed(() => gameState.value === GameState.PLAYING)

  // Game logic functions
  function initializeGame() {
    snake.body = [{ x: 10, y: 10 }]
    snake.direction = Direction.RIGHT
    gameStats.score = 0
    gameStats.level = 1
    gameStats.foodEaten = 0
    gameStats.gameTime = 0
    currentSpeed.value = getSpeedForDifficulty()
    generateFood()
  }

  function getSpeedForDifficulty(): number {
    const speeds = {
      [Difficulty.EASY]: 200,
      [Difficulty.MEDIUM]: 150,
      [Difficulty.HARD]: 100,
      [Difficulty.EXPERT]: 75
    }
    return speeds[gameConfig.difficulty]
  }

  function generateFood() {
    let newPosition: Position
    let attempts = 0
    const maxAttempts = gameConfig.gridSize * gameConfig.gridSize

    do {
      newPosition = {
        x: Math.floor(Math.random() * gameConfig.gridSize),
        y: Math.floor(Math.random() * gameConfig.gridSize)
      }
      attempts++

      // Prevent infinite loop if board is nearly full
      if (attempts >= maxAttempts) {
        // Find first available position
        for (let x = 0; x < gameConfig.gridSize; x++) {
          for (let y = 0; y < gameConfig.gridSize; y++) {
            const pos = { x, y }
            if (!isPositionOnSnake(pos)) {
              newPosition = pos
              break
            }
          }
        }
        break
      }
    } while (isPositionOnSnake(newPosition))

    const foodTypes = [FoodType.NORMAL, FoodType.BONUS, FoodType.SPEED]
    const weights = [0.7, 0.2, 0.1] // 70% normal, 20% bonus, 10% speed
    const randomValue = Math.random()
    let cumulativeWeight = 0
    let selectedType = FoodType.NORMAL

    for (let i = 0; i < foodTypes.length; i++) {
      cumulativeWeight += weights[i]
      if (randomValue <= cumulativeWeight) {
        selectedType = foodTypes[i]
        break
      }
    }

    const points = {
      [FoodType.NORMAL]: 10,
      [FoodType.BONUS]: 50,
      [FoodType.SPEED]: 25
    }

    food.value = {
      position: newPosition,
      type: selectedType,
      points: points[selectedType]
    }
  }

  function isPositionOnSnake(position: Position): boolean {
    return snake.body.some(segment => 
      segment.x === position.x && segment.y === position.y
    )
  }

  function moveSnake() {
    const head = { ...snake.body[0] }
    
    switch (snake.direction) {
      case Direction.UP:
        head.y -= 1
        break
      case Direction.DOWN:
        head.y += 1
        break
      case Direction.LEFT:
        head.x -= 1
        break
      case Direction.RIGHT:
        head.x += 1
        break
    }

    // Check wall collision
    if (head.x < 0 || head.x >= gameConfig.gridSize || 
        head.y < 0 || head.y >= gameConfig.gridSize) {
      gameOver()
      return
    }

    // Check self collision
    if (isPositionOnSnake(head)) {
      gameOver()
      return
    }

    snake.body.unshift(head)

    // Check food collision
    if (head.x === food.value.position.x && head.y === food.value.position.y) {
      eatFood()

      // Check victory condition (snake fills the entire board)
      if (snake.body.length >= gameConfig.gridSize * gameConfig.gridSize) {
        victory()
        return
      }
    } else {
      snake.body.pop()
    }
  }

  function eatFood() {
    gameStats.score += food.value.points
    gameStats.foodEaten += 1

    // Play sound effects
    if (food.value.type === FoodType.BONUS) {
      playBonusSound()
    } else if (food.value.type === FoodType.SPEED) {
      playSpeedSound()
    } else {
      playEatSound()
    }

    // Handle special food effects
    if (food.value.type === FoodType.SPEED) {
      currentSpeed.value = Math.max(50, currentSpeed.value - 10)
      updateGameSpeed()
    }

    // Level up every 5 foods
    if (gameStats.foodEaten % 5 === 0) {
      gameStats.level += 1
      currentSpeed.value = Math.max(50, currentSpeed.value - 5)
      updateGameSpeed()
      playLevelUpSound()
    }

    generateFood()
  }

  function changeDirection(newDirection: Direction) {
    // Allow any direction change if snake has only one segment
    if (snake.body.length === 1) {
      snake.direction = newDirection
      return
    }

    // Prevent reverse direction for longer snakes
    const opposites = {
      [Direction.UP]: Direction.DOWN,
      [Direction.DOWN]: Direction.UP,
      [Direction.LEFT]: Direction.RIGHT,
      [Direction.RIGHT]: Direction.LEFT
    }

    if (opposites[snake.direction] !== newDirection) {
      snake.direction = newDirection
    }
  }

  function startGame() {
    // Always initialize game when starting, regardless of previous state
    if (gameState.value === GameState.MENU ||
        gameState.value === GameState.GAME_OVER ||
        gameState.value === GameState.VICTORY) {
      initializeGame()
    }
    gameState.value = GameState.PLAYING
    // Ensure speed is updated based on current difficulty
    currentSpeed.value = getSpeedForDifficulty()
    startGameLoop()
    startGameTimer()
  }

  function pauseGame() {
    gameState.value = GameState.PAUSED
    stopGameLoop()
    stopGameTimer()
    playPauseSound()
  }

  function resumeGame() {
    gameState.value = GameState.PLAYING
    startGameLoop()
    startGameTimer()
    playResumeSound()
  }

  function gameOver() {
    gameState.value = GameState.GAME_OVER
    stopGameLoop()
    stopGameTimer()
    playGameOverSound()

    if (gameStats.score > gameStats.highScore) {
      gameStats.highScore = gameStats.score
      localStorage.setItem('snakeHighScore', gameStats.highScore.toString())
    }
  }

  function victory() {
    gameState.value = GameState.VICTORY
    stopGameLoop()
    stopGameTimer()
    playLevelUpSound() // Use level up sound for victory

    if (gameStats.score > gameStats.highScore) {
      gameStats.highScore = gameStats.score
      localStorage.setItem('snakeHighScore', gameStats.highScore.toString())
    }
  }

  function resetGame() {
    gameState.value = GameState.MENU
    stopGameLoop()
    stopGameTimer()
  }

  function startGameLoop() {
    if (gameLoop) clearInterval(gameLoop)
    gameLoop = setInterval(moveSnake, currentSpeed.value)
  }

  function updateGameSpeed() {
    if (gameState.value === GameState.PLAYING) {
      startGameLoop() // Restart with new speed
    }
  }

  function stopGameLoop() {
    if (gameLoop) {
      clearInterval(gameLoop)
      gameLoop = null
    }
  }

  function startGameTimer() {
    if (gameTimer) clearInterval(gameTimer)
    gameTimer = setInterval(() => {
      gameStats.gameTime += 1
    }, 1000)
  }

  function stopGameTimer() {
    if (gameTimer) {
      clearInterval(gameTimer)
      gameTimer = null
    }
  }

  // Keyboard controls
  function handleKeyPress(event: KeyboardEvent) {
    // Handle pause/resume for any game state except menu
    if (event.key === ' ') {
      event.preventDefault()
      if (gameState.value === GameState.PLAYING) {
        pauseGame()
      } else if (gameState.value === GameState.PAUSED) {
        resumeGame()
      }
      return
    }

    // Only handle direction changes when game is actively running
    if (!isGameRunning.value) return

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault()
        changeDirection(Direction.UP)
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault()
        changeDirection(Direction.DOWN)
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault()
        changeDirection(Direction.LEFT)
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault()
        changeDirection(Direction.RIGHT)
        break
    }
  }

  // Handle page visibility changes
  function handleVisibilityChange() {
    if (document.hidden && gameState.value === GameState.PLAYING) {
      pauseGame()
    }
  }

  // Lifecycle
  onMounted(() => {
    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    stopGameLoop()
    stopGameTimer()
  })

  return {
    // State
    gameState,
    gameConfig,
    snake,
    food,
    gameStats,
    currentSpeed,
    soundEnabled,

    // Computed
    gridCells,
    isGameRunning,

    // Methods
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    changeDirection,
    toggleSound,

    // Enums for template use
    GameState,
    Direction,
    FoodType,
    Difficulty
  }
}
