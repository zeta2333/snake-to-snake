import { ref, reactive, onMounted, onUnmounted } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export function useParticleSystem() {
  const particles = ref<Particle[]>([])
  let particleId = 0
  let animationFrame: number | null = null

  function createParticle(x: number, y: number, color: string = '#ffd700'): Particle {
    return {
      id: particleId++,
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 60,
      maxLife: 60,
      color,
      size: Math.random() * 4 + 2
    }
  }

  function addParticles(x: number, y: number, count: number = 8, color: string = '#ffd700') {
    for (let i = 0; i < count; i++) {
      particles.value.push(createParticle(x, y, color))
    }
  }

  function updateParticles() {
    particles.value = particles.value.filter(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life--
      particle.vx *= 0.98
      particle.vy *= 0.98
      return particle.life > 0
    })
  }

  function startAnimation() {
    function animate() {
      updateParticles()
      animationFrame = requestAnimationFrame(animate)
    }
    animate()
  }

  function stopAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }

  function clearParticles() {
    particles.value = []
  }

  // Food eat effect
  function createFoodEatEffect(x: number, y: number, foodType: string) {
    const colors = {
      NORMAL: '#ff4444',
      BONUS: '#ffd700',
      SPEED: '#00bfff'
    }
    const color = colors[foodType as keyof typeof colors] || '#ffd700'
    addParticles(x, y, 12, color)
  }

  // Level up effect
  function createLevelUpEffect(centerX: number, centerY: number) {
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2
      const distance = 50
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      addParticles(x, y, 3, '#ffd700')
    }
  }

  // Game over effect
  function createGameOverEffect(snakeBody: Array<{x: number, y: number}>, cellSize: number) {
    snakeBody.forEach((segment, index) => {
      setTimeout(() => {
        const x = segment.x * cellSize + cellSize / 2
        const y = segment.y * cellSize + cellSize / 2
        addParticles(x, y, 6, '#ff4444')
      }, index * 100)
    })
  }

  onMounted(() => {
    startAnimation()
  })

  onUnmounted(() => {
    stopAnimation()
  })

  return {
    particles,
    addParticles,
    clearParticles,
    createFoodEatEffect,
    createLevelUpEffect,
    createGameOverEffect
  }
}
