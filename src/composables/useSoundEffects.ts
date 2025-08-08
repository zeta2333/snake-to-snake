import { ref } from 'vue'

export function useSoundEffects() {
  const soundEnabled = ref(true)
  
  // Audio context for generating sounds
  let audioContext: AudioContext | null = null
  
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }
  
  function playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!soundEnabled.value) return
    
    initAudioContext()
    if (!audioContext) return
    
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }
  
  function playEatSound() {
    playTone(800, 0.1, 'square')
    setTimeout(() => playTone(1000, 0.1, 'square'), 50)
  }
  
  function playBonusSound() {
    playTone(600, 0.1, 'sine')
    setTimeout(() => playTone(800, 0.1, 'sine'), 50)
    setTimeout(() => playTone(1000, 0.1, 'sine'), 100)
    setTimeout(() => playTone(1200, 0.1, 'sine'), 150)
  }
  
  function playSpeedSound() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => playTone(1500 + i * 100, 0.05, 'sawtooth'), i * 30)
    }
  }
  
  function playGameOverSound() {
    playTone(400, 0.2, 'sawtooth')
    setTimeout(() => playTone(300, 0.2, 'sawtooth'), 100)
    setTimeout(() => playTone(200, 0.3, 'sawtooth'), 200)
  }
  
  function playLevelUpSound() {
    const notes = [523, 659, 784, 1047] // C, E, G, C
    notes.forEach((note, index) => {
      setTimeout(() => playTone(note, 0.2, 'sine'), index * 100)
    })
  }
  
  function playPauseSound() {
    playTone(440, 0.1, 'triangle')
  }
  
  function playResumeSound() {
    playTone(660, 0.1, 'triangle')
  }
  
  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }
  
  return {
    soundEnabled,
    playEatSound,
    playBonusSound,
    playSpeedSound,
    playGameOverSound,
    playLevelUpSound,
    playPauseSound,
    playResumeSound,
    toggleSound
  }
}
