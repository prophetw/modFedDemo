/// <reference types="vite/client" />

// /src/types/engine-global.d.ts

// 声明全局变量
declare global {
  // 如果是挂在 window 上：
  interface Window {
    BimEngine: typeof BimEngine
  }

  // 也可以在全局直接用 BimEngine，而不写 window.BimEngine
  // 则可以再声明一个 var：
  var BimEngine: typeof BimEngine
}