<template>
  <div class="particle-container">
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :style="{
        left: particle.x + 'px',
        top: particle.y + 'px',
        backgroundColor: particle.color,
        width: particle.size + 'px',
        height: particle.size + 'px',
        opacity: particle.life / particle.maxLife
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { useParticleSystem } from '@/composables/useParticleSystem'

const particleSystem = useParticleSystem()
const { particles } = particleSystem

// Expose particle system methods to parent
defineExpose(particleSystem)
</script>

<style scoped>
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 4px currentColor;
}
</style>
