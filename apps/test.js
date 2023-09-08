import { App } from '../components/index.js'

export default new App({
  id: 'test',
  name: 'rops test'
}).config({
  testa: {
    name: '测试1',
    desc: ' test1',
    reg: /^\/\/ropstest1$/,
    func: (e) => {
        e.reply('test1')
    }
  },
  testb: {
    name: '测试2',
    reg: /^\/\/ropstest2$/,
    func: (e) => {
      e.reply('test2')
    }
  }
}).plugin
