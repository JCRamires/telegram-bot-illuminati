const utils = require('./utils')

let timeLastCommandUsed
exports.setTimeLastCommandUsed = () => timeLastCommandUsed = Date.now()

exports.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

exports.checkIfMinutesHavePassed = function(lastTimeUsed, minutes) {
    if (lastTimeUsed != undefined) {
        if (Math.floor((new Date() - lastTimeUsed) / 60000) < minutes) {
            return false
        }
    }

    return true
}

exports.probability = percentage => Math.random() <= percentage / 100

exports.checkCommandCooldown = (commandCode, db, callback) => {
    if (utils.checkIfMinutesHavePassed(timeLastCommandUsed, 1)) {
        const timers = db.get().collection('timers')
        timers.findOne({ commandCode }, (err, result) => {
            if (err) {
                console.log('erro na consulta')
            } else {
                if (utils.checkIfMinutesHavePassed(result.lastTimeUsed, result.cooldownTime)) {
                    timers.update({ commandCode }, {
                        commandCode,
                        cooldownTime: result.cooldownTime,
                        lastTimeUsed: Date.now()
                    }, { upsert: true })

                    callback()
                }
            }
        })
    }
}
