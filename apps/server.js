import { App, Permission } from '../components/index.js'

export default new App({
  name: 'server',
  desc: '服务器'
}).config({
  serverList: {
    command: '//服务器 //服务器列表 //查询服务器 //查询服务器列表',
    desc: '查询服务器列表',

    reg: /^\/\/(查询)?服务器(列表)?$/,
    permission: Permission.admin,
    func: e => {
      //
    }
  },

  addServer: {
    command: '//添加服务器 //添加服务器配置 //新增服务器 //新增服务器配置',
    desc: '添加服务器',

    reg: /^\/\/(添加|增加|新增)服务器(配置)?$/,
    permission: Permission.admin,
    func: e => {
        e.reply('you are master')
    }
  },

  delServer: {
    command: '//删除服务器 //删除服务器配置',
    desc: '删除服务器',

    reg: /^\/\/删除服务器(配置)?$/,
    permission: Permission.admin,
    func: e => {
      e.reply(`your QQNumber is ${e.user_id}`)
    }
  },

  updateServer: {
    command: '//修改服务器 //修改服务器配置',
    desc: '修改服务器',

    reg: /^\/\/修改服务器(配置)?$/,
    permission: Permission.admin,
    func: e => {
      e.reply(`your QQNumber is ${e.user_id}`)
    }
  },

  bindServer: {
    command: '//绑定服务器',
    desc: '绑定服务器',

    reg: /^\/\/绑定服务器$/,
    permission: Permission.admin,
    func: e => {
      e.reply(`your QQNumber is ${e.user_id}`)
    }
  }
}).plugin
