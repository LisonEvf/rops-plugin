import lodash from 'lodash'
import { uuid } from 'oicq/lib/common.js'
import { exec } from 'child_process'

import { App, Permission } from '../components/index.js'
import { Job, Server } from '../models/index.js'

export default new App({
  name: 'job',
  desc: '任务'
}).config({
  jobList: {
    command: '//任务列表 //任务',
    desc: '查询任务列表',

    reg: /^\/\/任务(列表)?$/,
    func: e => {
        e.reply(Job.getJobListText())
    }
  },

  addJob: {
    command: '//添加任务 //增加任务 //新增任务',
    desc: '添加任务',

    reg: /^\/\/(添加|增加|新增)任务$/,
    permission: Permission.admin,
    func: async e => {
      let jobID = uuid()
      while (typeof Job.jobs[jobID] !== 'undefined' &&
      typeof Job.jobs[jobID].name !== 'undefined') {
        jobID = uuid()
      }
      Job.serverPool[jobID] = {}

      await e.reply('请按以下格式填写任务配置')
      e.reply(`//addJob
${jobID}
name: [任务名]
script: [shell script]`)
    }
  },

  _addJob: {
    reg: /^\/\/addJob\n/,
    permission: Permission.admin,
    func: async e => {
      const lines = e.msg.split('\n')
      if (lines.length < 3) {
        e.reply('同志，这有些不对吧')
        return
      }

      const script = lines.splice(2).join('\n').replace('script:', '')
      Job.add(lodash.trim(lines[1]), {
        name: lodash.trim(lines[2].split(':')[1]),
        script
      })
      e.reply('任务添加成功')
    }
  },

  delJob: {
    command: '//删除任务[任务ID] //移除任务[任务ID]',
    desc: '删除任务',

    reg: /^\/\/(删除|移除)任务(.*)$/,
    permission: Permission.admin,
    func: e => {
      Job.del(lodash.trim(e.msg.split('任务')[1]))
    }
  },

  updateJob: {
    command: '//修改任务',
    desc: '修改任务',

    reg: /^\/\/修改任务$/,
    permission: Permission.admin,
    func: async e => {
      const jobID = lodash.trim(e.msg.split('任务')[1])
      const job = Job.get(jobID)

      await e.reply('请按以下格式填写任务配置')
      e.reply(`//addJob
${jobID}
name: ${job.name}
script: ${job.script}`)
    }
  },

  _updateJob: {
    reg: /^\/\/updateJob\n/,
    permission: Permission.admin,
    func: async e => {
      const lines = e.msg.split('\n')
      if (lines.length < 3) {
        e.reply('同志，这有些不对吧')
        return
      }

      const script = lines.splice(2).join('\n').replace('script:', '')
      Job.update(lodash.trim(lines[1]), {
        name: lodash.trim(lines[2].split(':')[1]),
        script
      })
      e.reply('任务添加成功')
    }
  },

  execJob: {
    command: '///[服务器名][任务名] ///[任务名][服务器名] 如果群中服务器唯一 可直接///[任务名]',
    desc: '执行任务',

    reg: /^\/\/\/.*$/,
    func: async e => {
      const cmd = lodash.trim(e.msg.replace('///', ''))
      let callServer, callJob

      if (Server.getGroupServerList().length === 1) {
        callServer = Server.getGroupServerList()[0]
      }

      for (const server of Object.values(Server.servers)) {
        if (cmd.indexOf(server.name) !== -1) {
          callServer = server
        }
      }

      for (const job of Object.values(Job.jobs)) {
        if (cmd.indexOf(job.name) !== -1) {
          callJob = job
        }
      }

      if (typeof callServer !== 'undefined' && typeof callJob !== 'undefined') {
        const cmd = `ssh ${callServer.sshc} "cd ${callServer.path};${callJob.script}"`
        logger.info(cmd)
        const ret = await execSync(cmd)
        e.reply(ret.stdout)
      }

      if (typeof callServer === 'undefined') {
        e.reply(`啥！啥！啥！写的都是啥！\n${Server.getGroupServerListText(e.group_id)}`)
        return
      }

      if (typeof callJob === 'undefined') {
        e.reply(`恁想考研呀？\n${Job.getJobListText()}`)
      }
    }
  }
}).plugin

async function execSync (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr })
    })
  })
}
