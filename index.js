import { Version } from './components/index.js'

if (Bot?.logger?.info) {
  Bot.logger.info('---------^_^---------')
  Bot.logger.info(`rops插件${Version.version}初始化~`)
} else {
  console.log(`rops插件${Version.version}初始化~`)
}

if (!global.segment) {
  global.segment = (await import('oicq')).segment
}

export * from './apps/index.js'
