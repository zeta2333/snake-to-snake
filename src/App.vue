<script setup lang="ts">
import { watch } from 'vue'
import SnakeGame from './components/SnakeGame.vue'
import { useI18n } from './composables/useI18n'

const { t, currentLanguage } = useI18n()

// 动态更新页面标题
watch(currentLanguage, (newLang) => {
  if (newLang === 'zh') {
    document.title = '🐍 贪吃蛇游戏 - 现代化HTML5游戏'
    document.documentElement.lang = 'zh-CN'
  } else {
    document.title = '🐍 Snake Game - Modern HTML5 Game'
    document.documentElement.lang = 'en'
  }
}, { immediate: true })
</script>

<template>
  <div id="app">
    <SnakeGame />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>
