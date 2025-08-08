# 🐍 Snake Game - Vue 3 Edition

A modern, feature-rich Snake game built with Vue 3, TypeScript, and Vite. This game showcases the power of Vue 3's Composition API and modern web technologies.

## ✨ Features

### 🎮 Core Gameplay
- **Classic Snake mechanics** with modern enhancements
- **Multiple difficulty levels**: Easy, Medium, Hard, Expert
- **Progressive difficulty**: Speed increases as you level up
- **Score system** with persistent high scores
- **Level progression** every 5 foods eaten

### 🍎 Food Types
- **🍎 Normal Food**: Standard 10 points
- **🍇 Bonus Food**: Special 50 points (20% spawn rate)
- **⚡ Speed Food**: 25 points + speed boost (10% spawn rate)

### 🎵 Audio Experience
- **Dynamic sound effects** for all game actions
- **Procedurally generated audio** using Web Audio API
- **Toggleable sound** with visual indicator
- Different sounds for different food types and game events

### ✨ Visual Effects
- **Particle system** with food consumption effects
- **Level-up celebrations** with particle bursts
- **Snake head evolution system**: 🆕
  - 🤍 Basic Head (0-2 foods eaten)
  - 🟢 Green Head (3-5 foods eaten)
  - 🔵 Blue Head (6-8 foods eaten)
  - 🟣 Purple Head (9-11 foods eaten)
  - 🟡 Golden Head (12+ foods eaten) with special animations
- **Smooth animations** and transitions
- **Responsive design** for all screen sizes
- **Modern gradient backgrounds** and glassmorphism effects

### 🎯 Controls
- **Keyboard**: Arrow keys or WASD for movement
- **Spacebar**: Pause/Resume game
- **Touch-friendly**: On-screen directional pad for mobile
- **Responsive**: Adapts to different screen sizes

### 📱 Mobile Support
- **Touch controls** with directional pad
- **Responsive layout** for mobile devices
- **Optimized performance** for touch devices

## 🚀 Technology Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and building
- **CSS3** with modern features (Grid, Flexbox, Animations)
- **Web Audio API** for sound effects
- **Canvas-free** particle system using DOM elements

## 🛠️ Project Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```sh
# Install dependencies
npm install
```

### Development

```sh
# Start development server with hot reload
npm run dev
```

The game will be available at `http://localhost:5173`

### Production Build

```sh
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 How to Play

1. **Start the Game**: Click "Start Game" from the main menu
2. **Choose Difficulty**: Select your preferred difficulty level
3. **Move the Snake**: Use arrow keys or WASD to control the snake
4. **Eat Food**: Guide the snake to eat food and grow longer
5. **Avoid Collisions**: Don't hit walls or the snake's own body
6. **Level Up**: Eat 5 foods to advance to the next level
7. **Pause/Resume**: Press spacebar to pause or resume the game

### Scoring System
- Normal Food (🍎): 10 points
- Bonus Food (🍇): 50 points
- Speed Food (⚡): 25 points + speed increase
