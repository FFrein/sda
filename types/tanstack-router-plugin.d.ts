declare module '@tanstack/router-plugin/vite' {
  import type { Plugin } from 'vite'
  export interface TanStackRouterViteOptions {
    target?: 'react' | 'solid' | 'vue'
    autoCodeSplitting?: boolean
    routesDirectory?: string
    routeTreeFilepath?: string
  }
  export function tanstackRouter(options?: TanStackRouterViteOptions): Plugin
}


