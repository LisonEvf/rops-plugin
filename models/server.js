import { Version } from '../components/index.js'

export default {
    servers: Version.readDataSync('servers'),

    getServerListText () {
        let text = ''
        for (const serverID in this.servers) {
            const server = this.servers[serverID]
            text += `${serverID}
[${server.name}]
\t|${server.sshc}
\t|${server.path}
`
        }
        return text
    },

    getGroupServerList (groupID) {
        const groupList = []
        for (const serverID in this.servers) {
            const server = this.servers[serverID]
            if (groupID === server.groupID) {
                groupList.push(server)
            }
        }
        return groupList
    },

    getGroupServerListText (groupID) {
        let text = ''
        for (const serverID in this.servers) {
            const server = this.servers[serverID]
            if (server.groupID !== groupID) continue
            text += `${serverID}
[${server.name}]
\t|${server.sshc}
\t|${server.path}
`
        }
        return text
    },

    add (serverID, config) {
        if (typeof this.servers[serverID] === 'undefined') {
            throw Error(`服务器${serverID}不存在，请先“//添加服务器”以生成服务器ID`)
        }
        this.servers[serverID] = config

        return this.save()
    },

    del (serverID) {
        if (typeof this.servers[serverID] === 'undefined') {
            throw Error(`同志，你找谁？\n${this.getServerListText()}`)
        }
        delete this.servers[serverID]

        return this.save()
    },

    update (serverID, config) {
        if (typeof this.servers[serverID] === 'undefined') {
            throw Error(`同志，你找谁？\n${this.getServerListText()}`)
        }
        this.servers[serverID] = config

        return this.save()
    },

    get (serverID) {
        if (typeof this.servers[serverID] === 'undefined') {
            throw Error(`同志，你找谁？\n${this.getServerListText()}`)
        }
        return this.servers[serverID]
    },

    save () {
        return Version.saveDataSync('servers', this.servers)
    },

    bind (serverID, groupID) {
        if (typeof this.servers[serverID] === 'undefined') {
            throw Error(`同志，你找谁？\n${this.getServerListText()}`)
        }
        this.servers[serverID].groupID = groupID

        return this.save()
    }
}
