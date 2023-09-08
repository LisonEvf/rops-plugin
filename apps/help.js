import { App } from '../components/index.js'

export default new App({
    name: 'help',
    desc: 'rops帮助'
}).config({
    help: {
        command: '//帮助 //help //菜单',
        desc: '查看此帮助',

        reg: /^\/\/(帮助|help|菜单)$/,
        func: (e) => {
            e.reply('rops帮助诶')
        }
    }
}).plugin
