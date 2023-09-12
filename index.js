import fs from 'node:fs'

import Version from './components/Version.js'

if (Bot?.logger?.info) {
  Bot.logger.info('---------^_^---------')
  Bot.logger.info(`rops插件${Version.version}初始化~`)
} else {
  console.log(`rops插件${Version.version}初始化~`)
}

if (!global.segment) {
  global.segment = (await import('oicq')).segment
}

const files = fs.readdirSync(`${Version.path}/apps`).filter(file => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

const helpData = {}

const apps = {}
for (const i in files) {
  const name = files[i].replace('.js', '')

  if (ret[i].status !== 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  const AppCls = ret[i].value[Object.keys(ret[i].value)[0]]
  apps[name] = AppCls
  const app = new AppCls()
  helpData[name] = app.__helpDoc
}
Version.saveDataSync('help', helpData)
export { apps }
