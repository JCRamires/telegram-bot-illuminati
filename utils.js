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
