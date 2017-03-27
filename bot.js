const token = process.env.BOT_TOKEN

const utils = require('./utils')

const danbooru = require('danbooru')
const Tgfancy = require('tgfancy')

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
    timers.update({ commandCode: 'loli' }, { commandCode: 'loli', cooldownTime: 10 }, { upsert: true })
    timers.update({ commandCode: 'psx' }, { commandCode: 'psx', cooldownTime: 10 }, { upsert: true })
    timers.update({ commandCode: 'pizza' }, { commandCode: 'pizza', cooldownTime: 10 }, { upsert: true })
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

botInstance.onText(/loli/i, msg => {
    utils.checkCommandCooldown('loli', db, () => {
        switch (utils.getRandomInt(1,2)) {
            case 1:
                botInstance.sendSticker(msg.chat.id, './stickers/cocabird.webp', { reply_to_message_id: msg.message_id })
                break
            case 2:
                botInstance.sendDocument(msg.chat.id, './imagens/policecar.gif', { reply_to_message_id: msg.message_id })
                break
        }

        utils.settimeLastCommandUsed()
    })
})

botInstance.onText(/psx/i, msg => {
    utils.checkCommandCooldown('psx', db, () => {
        botInstance.sendSticker(msg.chat.id, './stickers/naoPerpetueErro.webp')
        utils.settimeLastCommandUsed()
    })
})

botInstance.onText(/nojo/i, msg => {
    utils.checkCommandCooldown('nojo', db, () => {
        botInstance.sendPhoto(msg.chat.id, './imagens/nojo.png', { reply_to_message_id: msg.message_id })
        utils.settimeLastCommandUsed()
    })
})

botInstance.onText(/pizza/i, msg => {
    utils.checkCommandCooldown('pizza', db, () => {
        botInstance.sendMessage(msg.chat.id, 'Coma pizza todo dia')
        utils.settimeLastCommandUsed
    })
})

botInstance.onText(/dota/i, msg => {
    utils.checkCommandCooldown('dota', db, () => {
        if (utils.probability(30)) {
            botInstance.sendMessage(msg.chat.id, 'Dota é sempre um erro')
            utils.settimeLastCommandUsed()
        }
    })
})

botInstance.onText(/tengu/i, msg => {
    utils.checkCommandCooldown('tengu', db, () => {
        if (utils.probability(30)) {
            botInstance.sendMessage(msg.chat.id, ':snake:')
            utils.settimeLastCommandUsed()
        }
    })
})

botInstance.onText(/korean/i, msg => {
    utils.checkCommandCooldown('korean', db, () => {
        if (utils.probability(30)) {
            switch (utils.getRandomInt(1,2)) {
                case 1:
                    botInstance.sendSticker(msg.chat.id, './stickers/anime_noose.webp', { reply_to_message_id: msg.message_id })
                    break
                case 2:
                    botInstance.sendSticker(msg.chat.id, './stickers/clorox.webp', { reply_to_message_id: msg.message_id })
                    break
            }
            utils.settimeLastCommandUsed()
        }
    })
})

botInstance.onText(/waifu/i, msg => {
    if (msg.from.first_name.includes('Hugo')) {
        utils.checkCommandCooldown('waifuUgo', db, () => {
            botInstance.sendMessage(msg.chat.id, 'Transou?', { reply_to_message_id: msg.message_id })
            utils.settimeLastCommandUsed()
        })
    }
})

botInstance.onText(/taiga/i, msg => {
    if (msg.from.first_name.includes('Hugo')) {
        utils.checkCommandCooldown('waifuUgo', db, () => {
            botInstance.sendMessage(msg.chat.id, 'Transou?', { reply_to_message_id: msg.message_id })
            utils.settimeLastCommandUsed()
        })
    }
})

botInstance.onText(/!teste/i, msg => {
    utils.checkCommandCooldown('teste', db, () => {
        botInstance.sendMessage(msg.chat.id, 'TESTE', { reply_to_message_id: msg.message_id })
    })
})
