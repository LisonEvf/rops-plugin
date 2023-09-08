import { App } from '../components/index.js'

export default new App({
  name: 'template',
  desc: '插件模版',
  event: 'message',
  priority: 50
}).config({
  master: {
    reg: /^\/\/master$/,
    check: (e, msg) => {
      return e.isMaster
    },
    func: (e) => {
        e.reply('you are master')
    }
  },
  whoami: {
    reg: /^\/\/whoami$/,
    func: (e) => {
      e.reply(`your QQNumber is ${e.user_id}`)
    }
  }
}).plugin
