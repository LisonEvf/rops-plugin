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
      Job.jobs[jobID] = {}

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

      const script = lines.splice(3).join('\n').replace('script:', '')
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
      e.reply('任务删除成功')
    }
  },

  updateJob: {
    command: '//修改任务',
    desc: '修改任务',

    reg: /^\/\/修改任务(.*)$/,
    permission: Permission.admin,
    func: async e => {
      const jobID = lodash.trim(e.msg.split('任务')[1])
      const job = Job.get(jobID)

      await e.reply('请按以下格式填写任务配置')
      e.reply(`//updateJob
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

      const script = lines.splice(3).join('\n').replace('script:', '')
      Job.update(lodash.trim(lines[1]), {
        name: lodash.trim(lines[2].split(':')[1]),
        script
      })
      e.reply('任务修改成功')
    }
  },

  execJob: {
    command: '///[服务器名][任务名] ///[任务名][服务器名] 如果群中服务器唯一 可直接///[任务名]',
    desc: '执行任务',

    reg: /^\/\/\/.*$/,
    func: async e => {
      const cmd = lodash.trim(e.msg.replace('///', ''))
      let callServer, callJob

      if (e.isGroup) {
        const serverList = Server.getGroupServerList(e.group_id)
        if (serverList.length === 1) {
          callServer = serverList[0]
        } else {
          for (const server in serverList) {
            if (cmd.indexOf(server.name) !== -1) {
              callServer = server
              break
            }
          }
        }
      } else {
        for (const server of Object.values(Server.servers)) {
          if (cmd.indexOf(server.name) !== -1) {
            callServer = server
            break
          }
        }
      }

      for (const job of Object.values(Job.jobs)) {
        if (cmd.indexOf(job.name) !== -1) {
          callJob = job
          break
        }
      }

      if (typeof callServer !== 'undefined' && typeof callJob !== 'undefined') {
        const cmd = /** echo ${callServer.pass} |  */`ssh ${callServer.sshc} '. ~/.bash_profile;. /etc/profile;cd ${callServer.path};${callJob.script}'`
        e.reply('Copy That', false, { recallMsg: 10 })
        const ret = await execSync(cmd)
        if (ret.error === null) {
          await e.reply('Misson Complete', false, { recallMsg: 10 })
          const forwardMsg = [{
            userInfo: {
              nickname: 'rops-plugin',
              user_id: 80000000
            },
            message: ret.stdout
          }]
          if (e.isGroup) {
            e.reply(await e.group.makeForwardMsg(forwardMsg))
          } else {
            e.reply(await e.friend.makeForwardMsg(forwardMsg))
          }
        } else {
          if (ret.stdout) {
            await e.reply(JSON.stringify(ret.stdout))
          }
          e.reply(JSON.stringify(ret.error))
        }
        logger.info('==============执行命令==================')
        logger.info(cmd)
        logger.info('=>')
        logger.info(ret.stdout)
        logger.info('=======================================')
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
