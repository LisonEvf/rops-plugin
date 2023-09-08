import fs from 'fs'

const pluginName = 'rops-plugin'
const pluginPath = `${process.cwd()}/plugins/${pluginName}`
const botVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version
const version = JSON.parse(fs.readFileSync(`${pluginPath}/package.json`, 'utf8')).version

export default {
  name: pluginName,
  path: pluginPath,
  isV3: botVersion[0] === '3',
  get version () {
    return version
  },
  get botVersion () {
    return botVersion
  },
  runtime () {
    console.log(`未能找到e.runtime，请升级至最新版Miao-Yunzai v3以使用${pluginName}`)
  }
}
