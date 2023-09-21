import { App, Permission } from '../components/index.js'

export default new App({
  name: 'role',
  desc: '角色'
}).config({
  adminList: {
    command: '//管理员查询 //管理员列表',
    desc: '管理员列表',

    reg: /^\/\/管理员(查询|列表)$/,
    permission: Permission.admin,
    func: e => {
        e.reply(JSON.stringify(Object.keys(Permission.data)))
    }
  },

  addAdmin: {
    command: '//添加管理员[QQ号] //增加管理员[QQ号] //新增管理员[QQ号]',
    desc: '增加管理员',

    reg: /^\/\/(添加|增加|新增)管理员[ |0-9]*$/,
    permission: Permission.master,
    func: e => {
      const qqNum = /[0-9]*$/.exec(e.msg)[0]
      if (typeof qqNum === 'undefined') {
        e.reg('输入："//(添加|增加|新增)管理员" 后跟被添加者的QQ号')
        return
      }
      Permission.add(qqNum)
      e.reply(`${qqNum}添加管理员成功`)
    }
  },

  delAdmin: {
    command: '//删除管理员[QQ号] //移除管理员[QQ号]',
    desc: '删除管理员',

    reg: /^\/\/(删除|移除)管理员[ |0-9]*$/,
    permission: Permission.master,
    func: e => {
      const qqNum = /[0-9]*$/.exec(e.msg)[0]
      if (typeof qqNum === 'undefined') {
        e.reg('输入："//(删除|移除)管理员" 后跟被添加者的QQ号')
        return
      }
      Permission.add(qqNum)
      e.reply(`${qqNum}删除管理员成功`)
    }
  },

  whoami: {
    command: '//whoami',
    desc: '查看自己角色',

    reg: /^\/\/whoami$/,
    func: e => {
      e.reply(`你是${Permission.getRole(e)[1]}`)
    }
  }
}).plugin
