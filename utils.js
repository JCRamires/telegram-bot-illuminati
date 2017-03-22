export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function checkIfMinutesHavePassed(lastTimeUsed, minutes) {
    if (lastTimeUsed != undefined) {
        if (Math.floor((new Date() - lastTimeUsed) / 60000) < minutes) {
            return false
        }
    }

    return true
}
