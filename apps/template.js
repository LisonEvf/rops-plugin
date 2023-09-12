import { App, Permission, Version } from '../components/index.js'

export default new App({
  name: 'template',
  desc: '插件模版',
  event: 'message',
  priority: 50
}).config({
  helloworld: {
    command: '//helloworld //helloWorld //Helloworld //HelloWorld',
    desc: 'helloworld',

    reg: /^\/\/(hello|Hello)(world|World)$/,
    func: e => {
        e.reply('Hello World!')
    }
  },

  about: {
    command: '//about //aboutme',
    desc: '关于rops',

    reg: /^\/\/about(me)?$/,
    func: e => {
      e.reply(`This is rops(Remote Operations)-plugint ${Version.version} base on Miao-Yunzai bot ${Version.botVersion}`)
    }
  },

  info: {
    command: '//info',
    desc: '详情',

    reg: /^\/\/info$/,
    permission: Permission.master,
    func: e => {
      e.reply(`TOOD ${Version.name}`)
    }
  }
}).plugin
