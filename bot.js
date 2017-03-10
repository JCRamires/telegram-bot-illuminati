'use strict'

const fs = require('fs')
const danbooru = require('danbooru')
const token = process.env.BOT_TOKEN

const Tgfancy = require("tgfancy");
let botInstance

// if(process.env.NODE_ENV === 'production') {
//   botInstance = new Bot(token)
//   console.log('webhook', process.env.WEB_ROOT + botInstance.token)
//   botInstance.setWebHook(process.env.WEB_ROOT + botInstance.token, './public.pem');
// }
// else {
botInstance = new Tgfancy(token, {
  tgfancy: {
    webSocket: true,
    url: 'wss://telegram-websocket-bridge-qalwkrjzzs.now.sh',
    autoOpen: true
  }
});
botInstance.setWebHook('');
// }

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

let timeLastCommandUsed

function checkIfMinuteHasPassed() {
  if (timeLastCommandUsed != undefined) {
    if (Math.floor((new Date() - timeLastCommandUsed)/60000) < 10) {
      return false
    }
  }
  
  return true
}

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
  if(checkIfMinuteHasPassed()) {
    utils.getRandomInt(1,2)

    switch (utils.getRandomInt(1,2)){
        case 1:
            botInstance.sendSticker(msg.chat.id, './stickers/cocabird.webp', {'reply_to_message_id': msg.message_id})
            break
        case 2:
            botInstance.sendDocument(msg.chat.id, './imagens/policecar.gif', {'reply_to_message_id': msg.message_id})
            break
    }
    
    timeLastCommandUsed = Date.now()    
  }
})

botInstance.onText(/psx/i, (msg, match) => {
  if(checkIfMinuteHasPassed()) {
    botInstance.sendSticker(msg.chat.id, './stickers/naoPerpetueErro.webp')
    
    timeLastCommandUsed = Date.now()
  }
})

botInstance.onText(/pizza/i, (msg, match) => {
  if(checkIfMinuteHasPassed()) {
    botInstance.sendMessage(msg.chat.id, 'Coma pizza todo dia')
    
    timeLastCommandUsed = Date.now()
  }
})
