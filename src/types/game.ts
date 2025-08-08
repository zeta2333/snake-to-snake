export interface Position {
  x: number
  y: number
}

export interface Snake {
  body: Position[]
  direction: Direction
}

export interface Food {
  position: Position
  type: FoodType
  points: number
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum FoodType {
  NORMAL = 'NORMAL',
  BONUS = 'BONUS',
  SPEED = 'SPEED'
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT'
}

export interface GameConfig {
  gridSize: number
  initialSpeed: number
  difficulty: Difficulty
}

export interface GameStats {
  score: number
  highScore: number
  level: number
  foodEaten: number
  gameTime: number
}
