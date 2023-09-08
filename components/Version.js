/* eslint-disable no-useless-escape */
import fs from 'fs'

const botVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version
const version = JSON.parse(fs.readFileSync(`${process.cwd()}/plugins/rops-plugin/package.json`, 'utf8')).version

export default {
  isV3: botVersion[0] === '3',
  get version () {
    return version
  },
  get botVersion () {
    return botVersion
  },
  runtime () {
    console.log('未能找到e.runtime，请升级至最新版Miao-Yunzai v3以使用rops-plugin')
  }
}
