const token = process.env.BOT_TOKEN

const utils = require('./utils')

const danbooru = require('danbooru')
const Tgfancy = require('tgfancy')
const gelbooru = require('./gelbooru').gelbooru

const botInstance = new Tgfancy(token, {
    polling: true,
    tgfancy: {
        emojification: true
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
    timers.update({ commandCode: 'loli' }, { commandCode: 'loli', cooldownTime: 60 }, { upsert: true })
    timers.update({ commandCode: 'psx' }, { commandCode: 'psx', cooldownTime: 60 }, { upsert: true })
    timers.update({ commandCode: 'pizza' }, { commandCode: 'pizza', cooldownTime: 60 }, { upsert: true })
    timers.update({ commandCode: 'tengu' }, { commandCode: 'tengu', cooldownTime: 0 }, { upsert: true })
    timers.update({ commandCode: 'korean' }, { commandCode: 'korean', cooldownTime: 0 }, { upsert: true })
    timers.update({ commandCode: 'waifuUgo' }, { commandCode: 'waifuUgo', cooldownTime: 60 }, { upsert: true })
    timers.update({ commandCode: 'nojo' }, { commandCode: 'nojo', cooldownTime: 10 }, { upsert: true })
    timers.update({ commandCode: 'dota' }, { commandCode: 'dota', cooldownTime: 60 }, { upsert: true })
    timers.update({ commandCode: 'teste' }, { commandCode: 'teste', cooldownTime: 0 }, { upsert: true })
})

console.log('botInstance server started...')

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

botInstance.onText(/^\/gelbooru((\s\w+)+)$/i, (msg, match) => {
    const searchTerm = match[1].trim()
    const result = gelbooru(searchTerm)
    if (result) {
        botInstance.sendPhoto(msg.chat.id, result)
    }
})

botInstance.onText(/loli/i, msg => {
    if (utils.probability(30)) {
        utils.checkCommandCooldown('loli', db, () => {
            switch (utils.getRandomInt(1,2)) {
                case 1:
                    botInstance.sendSticker(msg.chat.id, './stickers/cocabird.webp', { reply_to_message_id: msg.message_id })
                    break
                case 2:
                    botInstance.sendDocument(msg.chat.id, './imagens/policecar.gif', { reply_to_message_id: msg.message_id })
                    break
            }

            utils.setTimeLastCommandUsed()
        })
    }
})

botInstance.onText(/psx/i, msg => {
    utils.checkCommandCooldown('psx', db, () => {
        botInstance.sendSticker(msg.chat.id, './stickers/naoPerpetueErro.webp')
        utils.setTimeLastCommandUsed()
    })
})

botInstance.onText(/nojo/i, msg => {
    if (utils.probability(30)) {
        utils.checkCommandCooldown('nojo', db, () => {
            botInstance.sendPhoto(msg.chat.id, './imagens/nojo.png', { reply_to_message_id: msg.message_id })
            utils.setTimeLastCommandUsed()
        })
    }
})

botInstance.onText(/pizza/i, msg => {
    if (utils.probability(30)) {
        utils.checkCommandCooldown('pizza', db, () => {
            botInstance.sendMessage(msg.chat.id, 'Coma pizza todo dia')
            utils.setTimeLastCommandUsed()
        })
    }
})

botInstance.onText(/dota/i, msg => {
    if (utils.probability(17)) {
        utils.checkCommandCooldown('dota', db, () => {
            botInstance.sendMessage(msg.chat.id, 'Dota é sempre um erro')
            utils.setTimeLastCommandUsed()
        })
    }
})

botInstance.onText(/tengu/i, msg => {
    if (utils.probability(30)) {
        utils.checkCommandCooldown('tengu', db, () => {
            botInstance.sendMessage(msg.chat.id, ':snake:')
            utils.setTimeLastCommandUsed()
        })
    }
})

function koreanResponse(msg) {
    if (utils.probability(30)) {
        utils.checkCommandCooldown('korean', db, () => {
            switch (utils.getRandomInt(1,4)) {
                case 1:
                    botInstance.sendSticker(msg.chat.id, './stickers/anime_noose.webp', { reply_to_message_id: msg.message_id })
                    break
                case 2:
                    botInstance.sendSticker(msg.chat.id, './stickers/clorox.webp', { reply_to_message_id: msg.message_id })
                    break
                case 3:
                    botInstance.sendSticker(msg.chat.id, './stickers/fagDetected.webp', { reply_to_message_id: msg.message_id })
                    break
                case 4:
                    botInstance.sendSticker(msg.chat.id, './stickers/chegouAViciadaEmMacho.webp', { reply_to_message_id: msg.message_id })
                    break
            }
            utils.setTimeLastCommandUsed()
        })
    }
}

botInstance.onText(/korean/i, msg => {
    koreanResponse(msg)
})

botInstance.onText(/coreano/i, msg => {
    koreanResponse(msg)
})

function hugoResponse(msg) {
    if (msg.from.first_name.includes('Hugo')) {
        utils.checkCommandCooldown('waifuUgo', db, () => {
            botInstance.sendMessage(msg.chat.id, 'Transou?', { reply_to_message_id: msg.message_id })
            utils.setTimeLastCommandUsed()
        })
    }
}

botInstance.onText(/waifu/i, msg => {
    hugoResponse(msg)
})

botInstance.onText(/taiga/i, msg => {
    hugoResponse(msg)
})

botInstance.onText(/!teste/i, msg => {
    utils.checkCommandCooldown('teste', db, () => {
        botInstance.sendMessage(msg.chat.id, 'TESTE', { reply_to_message_id: msg.message_id })
    })
})
