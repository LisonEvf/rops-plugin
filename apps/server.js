import { App, Permission } from '../components/index.js'

export default new App({
  name: 'server',
  desc: '服务器'
}).config({
  addserver: {
    reg: /^\/\/添加服务器$/,
    permission: Permission.admin,
    func: (e) => {
        e.reply('you are master')
    }
  },
  delserver: {
    reg: /^\/\/删除服务器$/,
    func: (e) => {
      e.reply(`your QQNumber is ${e.user_id}`)
    }
  }
}).plugin
