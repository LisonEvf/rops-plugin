import { App } from '../components/index.js'

export default new App({
  name: 'job',
  desc: '任务'
}).config({
  joblist: {
    reg: /^\/\/joblist$/,
    check: (e) => {
      return e.isMaster
    },
    func: (e) => {
        e.reply('you are master')
    }
  },

  addjob: {
    reg: /^\/\/addjob$/,
    func: (e) => {
      e.reply(`your QQNumber is ${e.user_id}`)
    }
  }
}).plugin
