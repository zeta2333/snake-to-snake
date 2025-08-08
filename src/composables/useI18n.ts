import { ref, computed } from 'vue'

export type Language = 'zh' | 'en'

interface Translations {
  zh: Record<string, string>
  en: Record<string, string>
}

const translations: Translations = {
  zh: {
    // 游戏标题和基本信息
    'game.title': '🐍 贪吃蛇游戏',
    'game.welcome': '欢迎来到贪吃蛇游戏！',
    
    // 统计信息
    'stats.score': '分数',
    'stats.highScore': '最高分',
    'stats.level': '等级',
    'stats.time': '时间',
    'stats.sound': '音效',
    
    // 难度选择
    'difficulty.label': '难度',
    'difficulty.easy': '简单',
    'difficulty.medium': '中等',
    'difficulty.hard': '困难',
    'difficulty.expert': '专家',
    
    // 按钮
    'button.startGame': '开始游戏',
    'button.pause': '⏸️ 暂停',
    'button.resume': '▶️ 继续',
    'button.reset': '🔄 重置',
    'button.playAgain': '🎮 再玩一次',
    'button.mainMenu': '📋 主菜单',
    
    // 控制说明
    'controls.title': '🎮 控制方式',
    'controls.move': '移动蛇',
    'controls.pause': '暂停/继续',
    'controls.mobile': '移动端触摸控制',
    
    // 游戏状态
    'game.paused': '游戏暂停',
    'game.pauseHint': '按空格键或点击继续按钮继续游戏',
    'game.over': '游戏结束！',
    'game.victory': '🎉 胜利！🎉',
    'game.victoryMessage': '你已经填满了整个游戏板！',
    
    // 最终统计
    'final.score': '最终分数',
    'final.level': '到达等级',
    'final.foodEaten': '吃掉食物',
    'final.timePlayed': '游戏时间',
    'final.perfectScore': '完美分数',
    'final.finalLevel': '最终等级',
    'final.totalFood': '总共吃掉',
    'final.completionTime': '完成时间',
    'final.newRecord': '🎉 新纪录！🎉',
    'final.perfectGame': '🏆 完美游戏！🏆',
    
    // 语言切换
    'language.switch': '🌐 中/EN'
  },
  en: {
    // 游戏标题和基本信息
    'game.title': '🐍 Snake Game',
    'game.welcome': 'Welcome to Snake Game!',
    
    // 统计信息
    'stats.score': 'Score',
    'stats.highScore': 'High Score',
    'stats.level': 'Level',
    'stats.time': 'Time',
    'stats.sound': 'Sound',
    
    // 难度选择
    'difficulty.label': 'Difficulty',
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.hard': 'Hard',
    'difficulty.expert': 'Expert',
    
    // 按钮
    'button.startGame': 'Start Game',
    'button.pause': '⏸️ Pause',
    'button.resume': '▶️ Resume',
    'button.reset': '🔄 Reset',
    'button.playAgain': '🎮 Play Again',
    'button.mainMenu': '📋 Main Menu',
    
    // 控制说明
    'controls.title': '🎮 Controls',
    'controls.move': 'Move Snake',
    'controls.pause': 'Pause/Resume',
    'controls.mobile': 'Mobile Touch Controls',
    
    // 游戏状态
    'game.paused': 'Game Paused',
    'game.pauseHint': 'Press Space or click Resume to continue',
    'game.over': 'Game Over!',
    'game.victory': '🎉 VICTORY! 🎉',
    'game.victoryMessage': "You've filled the entire board!",
    
    // 最终统计
    'final.score': 'Final Score',
    'final.level': 'Level Reached',
    'final.foodEaten': 'Food Eaten',
    'final.timePlayed': 'Time Played',
    'final.perfectScore': 'Perfect Score',
    'final.finalLevel': 'Final Level',
    'final.totalFood': 'Total Food Eaten',
    'final.completionTime': 'Completion Time',
    'final.newRecord': '🎉 New High Score! 🎉',
    'final.perfectGame': '🏆 PERFECT GAME! 🏆',
    
    // 语言切换
    'language.switch': '🌐 EN/中'
  }
}

// 从localStorage获取保存的语言，默认为中文
const currentLanguage = ref<Language>(
  (localStorage.getItem('snakeGameLanguage') as Language) || 'zh'
)

export function useI18n() {
  const t = computed(() => {
    return (key: string): string => {
      return translations[currentLanguage.value][key] || key
    }
  })

  const switchLanguage = () => {
    currentLanguage.value = currentLanguage.value === 'zh' ? 'en' : 'zh'
    localStorage.setItem('snakeGameLanguage', currentLanguage.value)
  }

  const getCurrentLanguage = computed(() => currentLanguage.value)

  return {
    t,
    switchLanguage,
    currentLanguage: getCurrentLanguage
  }
}
