import { App, Permission, Version } from '../components/index.js'

export default new App({
    name: 'help',
    desc: 'rops帮助'
}).config({
    help: {
        command: '//帮助 //help //菜单 //[模块名]帮助 //[模块名]菜单 例如：//任务帮助',
        desc: '查看本帮助',

        reg: /^\/\/(.*)(帮助|help|菜单)$/,
        func: e => {
            const modelName = /^\/\/(.*)(帮助|help|菜单)$/.exec(e.original_msg)[1]

            const helpDoc = Version.readDataSync('help')

            for (const pluginK in helpDoc) {
                for (const ruleK in helpDoc[pluginK]) {
                    if (ruleK === 'desc') continue

                    const rule = helpDoc[pluginK][ruleK]
                    if (rule.permission < Permission.getRole(e)[0]) delete helpDoc[pluginK][ruleK]
                }
                if (Object.keys(helpDoc[pluginK]).length <= 1) {
                    delete helpDoc[pluginK]
                }
            }

            let helpText = ''

            for (const pluginK in helpDoc) {
                if (modelName !== '' && helpDoc[pluginK].desc !== modelName) continue

                helpText += `【${helpDoc[pluginK].desc}】\n`

                for (const ruleK in helpDoc[pluginK]) {
                    if (ruleK === 'desc') continue

                    const rule = helpDoc[pluginK][ruleK]
                    helpText += `\t[${rule.desc}]:\n`
                    for (const cmd of rule.command.split(' ')) {
                        helpText += `\t|\t${cmd}\n`
                    }
                }
            }
            e.reply(helpText)
        }
    }
}).plugin
