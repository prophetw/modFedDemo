import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host_app',
      // @ts-ignore
      remotes: {
        // 编译时  运行时加载这个远程组件。 下面的调整成运行时加载这个组件
        // remote_app: 'http://localhost:3001/my-vue-app/dist/remoteEntry.js',

        // 编译时  运行时加载这个远程组件。
        // 'BimEngine': {
        //   external: 'http://localhost:3001/engine-sdk/remoteEntry.js',
        //   // 告诉插件：这个远程容器是 webpack 打包的 var 格式
        //   format: 'var',
        //   from: 'webpack'
        // }
      },
      shared: ['vue']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
})
