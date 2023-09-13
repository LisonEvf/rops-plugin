import { Version } from '../components/index.js'

let jobs = Version.readDataSync('jobs')
if (Object.keys(jobs).length === 0) {
    jobs = {
        infoJobID: {
            name: '信息',
            script: 'ls'
        }
    }
}

export default {
    jobs,

    getJobListText () {
        let text = ''
        for (const jobID in this.jobs) {
            const job = this.jobs[jobID]
            text += `${job.name} | ${jobID}\n`
        }
        return text
    },

    add (jobID, config) {
        if (typeof this.jobs[jobID] === 'undefined') {
            throw Error(`任务${jobID}不存在，请先“//添加任务”以生成任务ID`)
        }
        this.jobs[jobID] = config

        return this.save()
    },

    del (jobID) {
        if (typeof this.jobs[jobID] === 'undefined') {
            throw Error(`任务${jobID}不存在\n${this.getJobListText()}`)
        }
        delete this.jobs[jobID]

        return this.save()
    },

    update (jobID, config) {
        if (typeof this.jobs[jobID] === 'undefined') {
            throw Error(`任务${jobID}不存在，请先“//添加任务”以生成任务ID`)
        }
        this.jobs[jobID] = config

        return this.save()
    },

    get (jobID) {
        if (typeof this.jobs[jobID] === 'undefined') {
            throw Error(`任务${jobID}不存在，请先“//添加任务”以生成任务ID`)
        }
        return this.jobs[jobID]
    },

    save () {
        return Version.saveDataSync('servers', this.jobs)
    }
}
