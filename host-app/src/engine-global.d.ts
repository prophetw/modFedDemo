/// <reference path="../public/engine-sdk/BimEngine.d.ts" />

import BimEngine from "BimEngine"

declare global {
  interface Window {
    BimEngine: typeof BimEngine
    viewer: BimEngine.Viewer | undefined
    currentProject: BimEngine.Project | undefined 
  }

}

export {}