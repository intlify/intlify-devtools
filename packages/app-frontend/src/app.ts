import { isChrome, Bridge } from '@intlify-devtools/shared'
import { createApp as createVueApp, App, ComponentPublicInstance } from 'vue'
import AppEntry from './App.vue'
import { Shell } from '.'

export function createApp(): App<Element> {
  const app = createVueApp(AppEntry)
  return app
}

export function connectApp(app: App<Element>, shell: Shell): void {
  shell.connect(async (bridge: Bridge) => {
    if (isChrome) {
      setupErrorHandler(app, bridge)
    }

    // TODO: here some logics

    bridge.send('connnected')
  })
}

function setupErrorHandler(app: App<Element>, bridge: Bridge): void {
  app.config.errorHandler = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ): void => {
    console.error('errorHandler', err, instance, info)
    bridge.send('ERROR', {
      message: (err as Error).message,
      stack: (err as Error).stack,
      component: instance?.$options.name || 'anonymous'
    })
  }
}