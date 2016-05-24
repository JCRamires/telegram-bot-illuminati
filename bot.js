'use strict'

const fs = require('fs')
const danbooru = require('danbooru')
const token = process.env.BOT_TOKEN

const Bot = require('node-telegram-bot-api')

const botInstance = new Bot(token, { polling: true })

const db = require('./db')

const utils = require('./utils')

db.connect(function (err) {
    if (err) {
        console.log('Falha na conexão com o mongo')
        process.exit(1)
    }

    db.get().createCollection('quotes')
})

console.log('botInstance server started...')

botInstance.onText(/^\/danbooru((\s\w+)+)$/i, (msg, match) => {
    danbooru.search(match[1].trim(), (err, data) => {
        if(err){
            botInstance.sendMessage(msg.chat.id, 'Erro no servidor :<', {'reply_to_message_id': msg.message_id})
        } else {
            if(data.random()){
                botInstance.sendMessage(msg.chat.id, data.random().source)
            }
        }
    })

})

botInstance.onText(/^\/add_quote\s(.*)$/i, (msg, match) => {
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

botInstance.onText(/^\/quote$/i, (msg, match) => {
    let collection = db.get().collection('quotes')
    collection.find({}).toArray().then((data) => {
        if(data){
            let quote = utils.getRandomItemFromList(data)
            botInstance.sendMessage(msg.chat.id, quote.mensagem)
        }
    })
})

botInstance.onText(/loli/i, (msg, match) => {
    utils.getRandomInt(1,2)

    switch (utils.getRandomInt(1,2)){
        case 1:
            botInstance.sendSticker(msg.chat.id, './stickers/cocabird.webp', {'reply_to_message_id': msg.message_id})
            break
        case 2:
            botInstance.sendDocument(msg.chat.id, './imagens/policecar.gif', {'reply_to_message_id': msg.message_id})
            break
    }
})

botInstance.onText(/psx/i, (msg, match) => {
    botInstance.sendSticker(msg.chat.id, './stickers/naoPerpetueErro.webp')
})

botInstance.onText(/pizza/i, (msg, match) => {
    botInstance.sendMessage(msg.chat.id, 'Coma pizza todo dia')
})
