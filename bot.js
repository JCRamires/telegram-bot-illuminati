const token = process.env.BOT_TOKEN

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
    timers.update({ commandCode: 'danbooru' }, { commandCode: 'danbooru', cooldownTime: 0 }, { upsert: true })
    timers.update({ commandCode: 'tengu' }, { commandCode: 'tengu', cooldownTime: 0 }, { upsert: true })
    timers.update({ commandCode: 'korean' }, { commandCode: 'korean', cooldownTime: 0 }, { upsert: true })
    timers.update({ commandCode: 'waifuUgo' }, { commandCode: 'waifuUgo', cooldownTime: 60 }, { upsert: true })
    timers.update({ commandCode: 'teste' }, { commandCode: 'teste', cooldownTime: 0 }, { upsert: true })
})

console.log('botInstance server started...')

let timeLastCommandUsed

function checkCommandCooldown(commandCode) {
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

                    console.log('true')
                    return true
                }

                console.log('false')
                return false
            }
        })
    }
}

function probability(percentage) {
    return Math.random() <= percentage / 100
}

botInstance.onText(/^\/danbooru((\s\w+)+)$/i, (msg, match) => {
    if (checkCommandCooldown('danbooru')) {
        danbooru.search(match[1].trim(), (err, data) => {
            if (err) {
                botInstance.sendMessage(msg.chat.id, 'Erro no servidor :<', { reply_to_message_id: msg.message_id })
            } else {
                if (data.random()) {
                    botInstance.sendMessage(msg.chat.id, data.random().source)
                }
            }
        })

        timeLastCommandUsed = Date.now()
    }
})

botInstance.onText(/loli/i, msg => {
    if (checkCommandCooldown('loli')) {
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
    }
})

botInstance.onText(/psx/i, msg => {
    if (checkCommandCooldown('psx')) {
        botInstance.sendSticker(msg.chat.id, './stickers/naoPerpetueErro.webp')

        timeLastCommandUsed = Date.now()
    }
})

botInstance.onText(/pizza/i, msg => {
    if (checkCommandCooldown('pizza')) {
        console.log('pizza time')
        botInstance.sendMessage(msg.chat.id, 'Coma pizza todo dia')

        timeLastCommandUsed = Date.now()
    } else {
        console.log('erro pizza')
    }
})

botInstance.onText(/tengu/i, msg => {
    if (checkCommandCooldown('tengu')) {
        if (probability(20)) {
            botInstance.sendMessage(msg.chat.id, ':snake:')

            timeLastCommandUsed = Date.now()
        }
    }
})

botInstance.onText(/korean/i, msg => {
    if (checkCommandCooldown('korean')) {
        if (probability(20)) {
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
    }
})

botInstance.onText(/waifu/i, msg => {
    if (msg.from.first_name.includes('Hugo')) {
        if (checkCommandCooldown('waifuUgo')) {
            botInstance.sendMessage(msg.chat.id, 'Transou?', { reply_to_message_id: msg.message_id })

            timeLastCommandUsed = Date.now()
        }
    }
})

botInstance.onText(/!teste/i, msg => {
    if (checkCommandCooldown('teste')) {
        botInstance.sendMessage(msg.chat.id, 'TESTE', { reply_to_message_id: msg.message_id })
    }
})
