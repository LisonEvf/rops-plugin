import { App, Permission, Version } from '../components/index.js'

export default new App({
    name: 'help',
    desc: 'rops帮助'
}).config({
    help: {
        command: '//帮助 //help //菜单',
        desc: '查看此帮助',

        reg: /^\/\/(帮助|help|菜单)$/,
        func: e => {
            const helpDoc = Version.readDataSync('help')
            let helpText = ''

            for (const plugin of helpDoc) {
                helpText += `${plugin.desc}:\n`

                for (const ruleK in plugin) {
                    if (ruleK === 'desc') continue

                    const rule = plugin[ruleK]
                    if (rule.permission < Permission.getRole(e)[0]) continue
                    helpText += `\t|${rule.desc}:\n\t|\t${rule.command}`
                }
            }
            e.reply(helpText)
        }
    },

    detailHelp: {
        command: '//[模块名]帮助 //[模块名]菜单 例如：//任务帮助',
        desc: '模块帮助',

        reg: /^\/\/(.*)(帮助|help|菜单)$/,
        func: e => {
            const modelName = /^\/\/(.*)(帮助|help|菜单)$/.exec(e.original_msg)[1]

            const helpDoc = Version.readDataSync('help')
            let helpText = ''

            for (const plugin of helpDoc) {
                if (plugin.desc !== modelName) continue

                helpText += `${plugin.desc}:\n`
                for (const ruleK in plugin) {
                    if (ruleK === 'desc') continue

                    const rule = plugin[ruleK]
                    if (rule.permission < Permission.getRole(e)[0]) continue
                    helpText += `\t|${rule.desc}:\n\t|\t${rule.command}`
                }
            }
            e.reply(helpText)
        }
    }
}).plugin
