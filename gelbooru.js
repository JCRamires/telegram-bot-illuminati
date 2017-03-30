const https = require('https')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const stringify = require('query-string').stringify
const getRandomInt = require('./utils').getRandomInt

exports.gelbooru = (tags, msg, botInstance) => {
    const config = {
        page: 'dapi',
        s: 'post',
        q: 'index',
        tags
    }
    let response
    https.get(`https://gelbooru.com/index.php?${stringify(config)}`, response => {
        let data = ''
        response.on('error', err => console.log(err))
        response.on('data', data_ => data += data_)
        response.on('end', () => {
            parser.parseString(data, (err, result) => {
                const randomPost = getRandomInt(1, result.posts.post.length)
                if (result.posts.post[randomPost - 1]) {
                    response = `http:${result.posts.post[randomPost - 1].sample_url}`
                    botInstance.sendPhoto(msg.chat.id, response)
                }
            })
        })
    })

    return response
}
