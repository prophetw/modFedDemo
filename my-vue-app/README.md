## 导出控制

```ts
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

// type GeneratedCodePreset = 'es5' | 'es2015';
// The Module Federation plugin (@originjs/vite-plugin-federation) uses top-level await statements in its generated code
// Top-level await is only available in modern JavaScript (ES2022+)

    target: 'esnext',
    minify: true,
    cssCodeSplit: true,


// export type InternalModuleFormat = 'amd' | 'cjs' | 'es' | 'iife' | 'system' | 'umd';
// export type ModuleFormat = InternalModuleFormat | 'commonjs' | 'esm' | 'module' | 'systemjs';

    // 如果需要导出 systemjs 模块 
   //  rollupOptions: {
   //    output: {
   //      format: 'system', // 这里指定输出格式为 system
   //    },
   //  },
  },
})

```