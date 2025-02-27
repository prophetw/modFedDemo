import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
   base: './', // 相对路径模式
  plugins: [
    vue(),
     federation({
      name: 'remote_app', // 远程应用名
      filename: 'remoteEntry.js', // 暴露出来的入口文件
      exposes: {
        // 想要暴露给外部使用的模块
        // './RemoteApp': './src/App.vue',
        './RemoteApp': './src/components/HelloWorld.vue',
      },
      shared: ['vue'], // 共享依赖
    }),
  ],
  build: {
    assetsDir: '',
    target: 'esnext',
    minify: true,
    cssCodeSplit: true,

    // export systemjs
    // rollupOptions: {
    //   output: {
    //     format: 'system', // 这里指定输出格式为 system
    //   },
    // },
  },
})
