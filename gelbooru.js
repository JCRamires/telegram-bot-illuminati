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
                const randomInt = getRandomInt(1, result.posts.post.length)
                const randomPost = result.posts.post[randomInt - 1]
                if (randomPost) {
                    response = `http:${randomPost.$.sample_url}`
                    console.log(response)
                    botInstance.sendPhoto(msg.chat.id, response)
                }
            })
        })
    })

    return response
}
