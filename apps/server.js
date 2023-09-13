import lodash from 'lodash'
import { uuid } from 'oicq/lib/common.js'

import { App, Permission } from '../components/index.js'
import { Server } from '../models/index.js'

export default new App({
  name: 'server',
  desc: '服务器'
}).config({
  serverList: {
    command: '//服务器 //服务器列表 //查询服务器 //查询服务器列表',
    desc: '查询服务器列表',

    reg: /^\/\/(查询)?服务器(列表)?$/,
    func: e => {
      if (e.isGroup) {
        e.reply(Server.getGroupServerListText(e.group_id))
      } else if (Permission.check(e)) {
        e.reply(Server.getServerListText())
      } else {
        e.reply('前面的区域，以后再来探索吧～')
      }
    }
  },

  addServer: {
    command: '//添加服务器 //添加服务器配置 //新增服务器 //新增服务器配置',
    desc: '添加服务器',

    reg: /^\/\/(添加|增加|新增)服务器(配置)?$/,
    permission: Permission.admin,
    func: async function (e) {
      let serverID = uuid()
      while (typeof Server.serverPool[serverID] !== 'undefined' &&
       typeof Server.serverPool[serverID].sshc !== 'undefined') {
        serverID = uuid()
      }
      Server.serverPool[serverID] = {}

      await e.reply('请按以下格式填写服务器配置')
      e.reply(`//addServer
${serverID}
name: [服务器名]
sshc: [root@1.1.1.1 -p 1022]
pass: [密码]
path: [工作路径 例如/srv/server]`)
    }
  },

  _addServer: {
    reg: /^\/\/addServer\n/,
    permission: Permission.admin,
    func: async e => {
      const lines = e.msg.split('\n')
      if (lines.length < 6) {
        e.reply('同志，这有些不对吧')
        return
      }

      Server.add(lodash.trim(lines[1]), {
        name: lodash.trim(lines[2].split(':')[1]),
        sshc: lodash.trim(lines[3].split(':')[1]),
        pass: lodash.trim(lines[4].split(':')[1]),
        path: lodash.trim(lines[5].split(':')[1])
      })
      e.reply('服务器添加成功')
    }
  },

  delServer: {
    command: '//删除服务器[服务器ID]',
    desc: '删除服务器',

    reg: /^\/\/删除服务器(.*)?$/,
    permission: Permission.admin,
    func: e => {
      Server.del(lodash.trim(e.msg.split('服务器')[1]))
      e.reply('服务器删除成功')
    }
  },

  updateServer: {
    command: '//修改服务器[服务器ID]',
    desc: '修改服务器',

    reg: /^\/\/修改服务器(.*)$/,
    permission: Permission.admin,
    func: async e => {
      const serverID = lodash.trim(e.msg.split('服务器')[1])
      const server = Server.get(serverID)

      await e.reply('请按以下格式填写服务器配置')
      e.reply(`//updateServer
${serverID}
name: ${server.name}
sshc: ${server.sshc}
pass: ${server.pass}
path: ${server.path}`)
    }
  },

  _updateServer: {
    reg: /^\/\/updateServer\n/,
    permission: Permission.admin,
    func: async e => {
      const lines = e.msg.split('\n')
      if (lines.length < 6) {
        e.reply('同志，这有些不对吧')
        return
      }

      Server.update(lodash.trim(lines[1]), {
        name: lodash.trim(lines[2].split(':')[1]),
        sshc: lodash.trim(lines[3].split(':')[1]),
        pass: lodash.trim(lines[4].split(':')[1]),
        path: lodash.trim(lines[5].split(':')[1])
      })
      e.reply('服务器添加成功')
    }
  },

  bindServer: {
    command: '//绑定服务器[服务器ID]',
    desc: '绑定服务器',

    reg: /^\/\/绑定服务器(.*)$/,
    permission: Permission.admin,
    func: async e => {
      if (!e.isGroup) {
        e.reply('请到群中绑定服务器')
        return
      }
      const serverID = lodash.trim(e.msg.replace('//绑定服务器', ''))
      Server.bind(serverID, e.group_id)
      e.reply('服务器绑定成功')
    }
  }
}).plugin
