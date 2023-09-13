import Version from './Version.js'

export default {
    master: 0,
    admin: 1,

    data: Version.readDataSync('permission'),

    check (e, rule) {
        if (e.isMaster) return true
        return this.data[e.user_id] && rule.permission && this.data[e.user_id] <= rule.permission
    },

    getRole (e) {
        if (e.isMaster) return [0, '主人']
        switch (this.data[e.user_id]) {
            case this.admin:
                return [1, '管理员']
            default:
                return [999, '谁？']
        }
    },

    add (qqNum, permissionLevel = 1) {
        this.data[qqNum] = permissionLevel
        return Version.saveDataSync('permission', this.data)
    },

    del (qqNum) {
        delete this.data[qqNum]
        return Version.saveDataSync('permission', this.data)
    }
}
