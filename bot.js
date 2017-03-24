const token = process.env.BOT_TOKEN

const fs = require('fs')

const utils = require('./utils')

const danbooru = require('danbooru')
const Tgfancy = require('tgfancy')

const botInstance = new Tgfancy(token, {
    tgfancy: {
        emojification: true,
        webSocket: {
            url: 'wss://telegram-websocket-bridge-qalwkrjzzs.now.sh',
            autoOpen: true
        }
    }
})

const db = require('./db')

db.connect( err => {
    if (err) {
        console.log('Falha na conexão com o mongo')
        process.exit(1)
    }

    db.get().createCollection('timers')

    const timers = db.get().collection('timers')
    timers.update({ commandCode: 'loli' }, { commandCode: 'loli', cooldownTime: 10 }, { upsert: true })
    timers.update({ commandCode: 'psx' }, { commandCode: 'psx', cooldownTime: 10 }, { upsert: true })
    timers.update({ commandCode: 'pizza' }, { commandCode: 'pizza', cooldownTime: 10 }, { upsert: true })
    timers.update({ commandCode: 'tengu' }, { commandCode: 'tengu', cooldownTime: 0 }, { upsert: true })
    timers.update({ commandCode: 'korean' }, { commandCode: 'korean', cooldownTime: 0 }, { upsert: true })
    timers.update({ commandCode: 'waifuUgo' }, { commandCode: 'waifuUgo', cooldownTime: 60 }, { upsert: true })
    timers.update({ commandCode: 'nojo' }, { commandCode: 'nojo', cooldownTime: 10 }, { upsert: true })
    timers.update({ commandCode: 'dota' }, { commandCode: 'dota', cooldownTime: 10 }, { upsert: true })
    timers.update({ commandCode: 'teste' }, { commandCode: 'teste', cooldownTime: 0 }, { upsert: true })
})

console.log('botInstance server started...')

let timeLastCommandUsed

function checkCommandCooldown(commandCode, callback) {
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

function probability(percentage) {
    return Math.random() <= percentage / 100
}

botInstance.onText(/^\/danbooru((\s\w+)+)$/i, (msg, match) => {
    const searchTerm = match[1].trim()
    danbooru.search(searchTerm, (err, data) => {
        if (err) {
            botInstance.sendMessage(msg.chat.id, 'Erro no servidor :<', { reply_to_message_id: msg.message_id })
        } else {
            const randomImage = data.random()
            if (randomImage) {
                const imgUrl = randomImage.large_file_url
                if (imgUrl) {
                    botInstance.sendPhoto(msg.chat.id, `http://danbooru.donmai.us${imgUrl}`)
                }
            }
        }
    })
})

botInstance.onText(/loli/i, msg => {
    checkCommandCooldown('loli', () => {
        utils.getRandomInt(1,2)

        switch (utils.getRandomInt(1,2)) {
            case 1:
                botInstance.sendSticker(msg.chat.id, './stickers/cocabird.webp', { reply_to_message_id: msg.message_id })
                break
            case 2:
                botInstance.sendDocument(msg.chat.id, './imagens/policecar.gif', { reply_to_message_id: msg.message_id })
                break
        }

        timeLastCommandUsed = Date.now()
    })
})

botInstance.onText(/psx/i, msg => {
    checkCommandCooldown('psx', () => {
        botInstance.sendSticker(msg.chat.id, './stickers/naoPerpetueErro.webp')

        timeLastCommandUsed = Date.now()
    })
})

botInstance.onText(/nojo/i, msg => {
    checkCommandCooldown('nojo', () => {
        botInstance.sendPhoto(msg.chat.id, './imagens/nojo.png', { reply_to_message_id: msg.message_id })


    })
})

botInstance.onText(/pizza/i, msg => {
    checkCommandCooldown('pizza', () => {
        botInstance.sendMessage(msg.chat.id, 'Coma pizza todo dia')

        timeLastCommandUsed = Date.now()
    })
})

botInstance.onText(/dota/i, msg => {
    checkCommandCooldown('dota', () => {
        botInstance.sendMessage(msg.chat.id, 'Dota é sempre um erro')

        timeLastCommandUsed = Date.now()
    })
})

botInstance.onText(/tengu/i, msg => {
    checkCommandCooldown('tengu', () => {
        if (probability(30)) {
            botInstance.sendMessage(msg.chat.id, ':snake:')

            timeLastCommandUsed = Date.now()
        }
    })
})

botInstance.onText(/korean/i, msg => {
    checkCommandCooldown('korean', () => {
        if (probability(30)) {
            utils.getRandomInt(1,2)

            switch (utils.getRandomInt(1,2)) {
                case 1:
                    botInstance.sendSticker(msg.chat.id, './stickers/anime_noose.webp', { reply_to_message_id: msg.message_id })
                    break
                case 2:
                    botInstance.sendSticker(msg.chat.id, './stickers/clorox.webp', { reply_to_message_id: msg.message_id })
                    break
            }

            timeLastCommandUsed = Date.now()
        }
    })
})

botInstance.onText(/waifu/i, msg => {
    if (msg.from.first_name.includes('Hugo')) {
        checkCommandCooldown('waifuUgo', () => {
            botInstance.sendMessage(msg.chat.id, 'Transou?', { reply_to_message_id: msg.message_id })

            timeLastCommandUsed = Date.now()
        })
    }
})

botInstance.onText(/taiga/i, msg => {
    if (msg.from.first_name.includes('Hugo')) {
        checkCommandCooldown('waifuUgo', () => {
            botInstance.sendMessage(msg.chat.id, 'Transou?', { reply_to_message_id: msg.message_id })

            timeLastCommandUsed = Date.now()
        })
    }
})

botInstance.onText(/!teste/i, msg => {
    checkCommandCooldown('teste', () => {
        botInstance.sendMessage(msg.chat.id, 'TESTE', { reply_to_message_id: msg.message_id })
    })
})
