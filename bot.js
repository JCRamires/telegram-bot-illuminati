'use strict'

const fs = require('fs')
const danbooru = require('danbooru')
const token = process.env.BOT_TOKEN

const Bot = require('node-telegram-bot-api')
let bot

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.WEB_ROOT + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

const db = require('./db')

const utils = require('./utils')

db.connect(function (err) {
    if (err) {
        console.log('Falha na conexão com o mongo')
        process.exit(1)
    }

    db.get().createCollection('quotes')
})

console.log('bot server started...')

bot.onText(/^\/danbooru((\s\w+)+)$/i, (msg, match) => {
    danbooru.search(match[1].trim(), (err, data) => {
        if(err){
            bot.sendMessage(msg.chat.id, 'Erro no servidor :<', {'reply_to_message_id': msg.message_id})
        } else {
            if(data.random()){
                bot.sendMessage(msg.chat.id, data.random().source)
            }
        }
    })

})

bot.onText(/^\/add_quote\s(.*)$/i, (msg, match) => {
    let criador
    if (msg.from.username) {
        criador = msg.from.username
    } else {
        criador = msg.from.first_name
    }

    let quote = {
        mensagem: match[1],
        criador: criador,
        criada: Date.now()
    }

    let collection = db.get().collection('quotes')
    collection.insertOne(quote)
})

bot.onText(/^\/quote$/i, (msg, match) => {
    let collection = db.get().collection('quotes')
    collection.find({}).toArray().then((data) => {
        if(data){
            let quote = utils.getRandomItemFromList(data)
            bot.sendMessage(msg.chat.id, quote.mensagem)
        }
    })
})

bot.onText(/loli/i, (msg, match) => {
    utils.getRandomInt(1,2)

    switch (utils.getRandomInt(1,2)){
        case 1:
            bot.sendSticker(msg.chat.id, './stickers/cocabird.webp', {'reply_to_message_id': msg.message_id})
            break
        case 2:
            bot.sendDocument(msg.chat.id, './imagens/policecar.gif', {'reply_to_message_id': msg.message_id})
            break
    }
})

bot.onText(/psx/i, (msg, match) => {
    bot.sendSticker(msg.chat.id, './stickers/naoPerpetueErro.webp')
})

bot.onText(/pizza/i, (msg, match) => {
    bot.sendMessage(msg.chat.id, 'Coma pizza todo dia')
})
