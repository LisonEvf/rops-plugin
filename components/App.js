import lodash from 'lodash'
import Plugin from './Plugin.js'

export default class {
  constructor (info) {
    const rules = this.rules = []
    const checks = this.checks = []
    this.plugin = class extends Plugin {
      constructor () {
        super({
          name: `rops:${info.name || info.id}`,
          dsc: info.desc || info.name,
          event: info.event === 'poke' ? 'notice.*.poke' : 'message',
          priority: info.priority || 50,
          rule: rules
        })
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

  config (key, func, app = {}) {
    if (lodash.isPlainObject(key)) {
      lodash(key).forEach((app, appk) => {
        this.config(appk, app.func, app)
      })
    }

    key = lodash.camelCase(key)
    this.plugin.prototype[key] = async function (e) {
      e = this.e || e
      const selfID = e.self_id || e.bot?.uin || Bot.uin
      if (app.event === 'poke') {
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
      reg: app.event === 'poke' ||
        (typeof app.reg === 'string' && app.reg === 'noCheck') ||
        typeof reg === 'undefined'
         ? '.*'
         : lodash.trim(app.reg.toString(), '/'),
      fnc: key
    })

    if (app.check) {
      this.checks.push(app.check)
    }

    return this
  }
}
