import { App } from '../components/index.js'

export default new App({
  name: 'role',
  desc: '角色管理'
}).config({
  master: {
    reg: /^\/\/master$/,
    check: (e) => {
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
