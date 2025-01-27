import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
   base: './', // 相对路径模式
  plugins: [
    vue(),
     federation({
      name: 'remote_app', // 远程应用名
      filename: 'remoteEntry.js', // 暴露出来的入口文件
      exposes: {
        // 想要暴露给外部使用的模块
        './RemoteApp': './src/App.vue',
      },
      shared: ['vue'], // 共享依赖
      /**
       * 关键：让它自动推断资源路径，不再额外拼接 assets
       */
      // publicPath: 'auto'
    })
  ],
  build: {
    assetsDir: '',
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
