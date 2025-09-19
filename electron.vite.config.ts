import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@main': resolve('src/main/')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        // Указываем, где искать файлы маршрутов и куда класть сгенерённое дерево
        routeTreeFilepath: 'src/renderer/src/app/constants/routes',
        routesDirectory: 'src/renderer/src/app/constants/routes'
      }),
      react()
    ]
  }
})
