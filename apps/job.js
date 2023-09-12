import { App, Permission } from '../components/index.js'

export default new App({
  name: 'job',
  desc: '任务'
}).config({
  jobList: {
    command: '//任务列表 //任务',
    desc: '查询任务列表',

    reg: /^\/\/任务(列表)?$/,
    func: e => {
        e.reply('you are master')
    }
  },

  addJob: {
    command: '//添加任务 //增加任务 //新增任务',
    desc: '添加任务',

    reg: /^\/\/(添加|增加|新增)任务$/,
    permission: Permission.admin,
    func: e => {
      e.reply(`your QQNumber is ${e.user_id}`)
    }
  },

  delJob: {
    command: '//删除任务 //移除任务',
    desc: '删除任务',

    reg: /^\/\/(删除|移除)任务$/,
    func: e => {
      e.reply(`your QQNumber is ${e.user_id}`)
    }
  },

  updateJob: {
    command: '//修改任务',
    desc: '修改任务',

    reg: /^\/\/修改任务$/,
    func: e => {
      e.reply(`your QQNumber is ${e.user_id}`)
    }
  }
}).plugin
