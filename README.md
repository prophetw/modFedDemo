# Micro APP

> nodejs 18

## Host app vite.config.ts 配置 federation 引入远程应用

```ts vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host_app',
      remotes: {
        // remote_app: 'http://localhost:3001/assets/remoteEntry.js'
        // 如果路径不同，按实际情况改
        remote_app: 'http://localhost:3001/remoteEntry.js'
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

```

## Remote app 1 vite.config.ts 配置 federation 暴露模块 

```ts vite.config.ts
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
    cssCodeSplit: false
  },
})
```

## 关于部署

- 远程应用部署到 CDN 或者可访问的静态资源服务器，或者直接交给 host-app 去部署。
- host-app 部署到任意静态资源服务器即可。