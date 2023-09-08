import lodash from 'lodash'
import Plugin from './Plugin.js'

export default class {
  constructor (info) {
    const rules = this.rules = []
    const checks = this.checks = []
    const help = this.help = {}

    this.plugin = class extends Plugin {
      constructor () {
        super({
          name: info.name,
          dsc: info.desc || info.name,
          event: info.event === 'poke' ? 'notice.*.poke' : 'message',
          priority: info.priority || 50,
          // task: {},
          rule: rules
        })
        help.desc = info.desc
        this.help = help
      }

      accept (e) {
        e.original_msg = e.original_msg || e.msg
        for (const checkFunc of checks) {
          if (checkFunc(e, e.original_msg)) {
            return true
          }
        }
      }
    }
  }

  config (ruleKey, func, rule = {}) {
    if (lodash.isPlainObject(ruleKey)) {
      lodash(ruleKey).forEach((rule, ruleKey) => {
        this.config(ruleKey, rule.func, rule)
      })
    } else {
      ruleKey = lodash.camelCase(ruleKey)
      this.plugin.prototype[ruleKey] = async function (e) {
        e = this.e || e
        const selfID = e.self_id || e.bot?.uin || Bot.uin
        if (rule.event === 'poke') {
          if (e.notice_type === 'group') {
            if (e.target_id !== selfID && !e.isPoke) {
              return false
            }

            if (e.user_id === selfID) {
              e.user_id = e.operator_id
            }
          }
          e.isPoke = true
          e.msg = '#poke#'
        }
        e.original_msg = e.original_msg || e.msg

        try {
          return await func.call(this, e)
        } catch (err) {
          if (err?.message) {
            return e.reply(err.message)
          } else {
            throw err
          }
        }
      }

      this.rules.push({
        reg: (rule.event === 'poke' || // 戳一戳
          (typeof rule.reg === 'string' && rule.reg === 'noCheck') || // noCheck
          typeof rule.reg === 'undefined' // 未定义
          ? '.*' // 全监听
          : lodash.trim(rule.reg.toString(), '/')),
        fnc: ruleKey
      })

      if (rule.check) {
        this.checks.push(rule.check)
      }

      this.help[ruleKey] = {
        command: rule.command || (rule.event === 'poke' ? '戳一戳' : rule.reg),
        desc: rule.desc || this.plugin.dsc
      }
    }
    return this
  }
}
