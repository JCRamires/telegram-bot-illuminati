const https = require('https')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const stringify = require('query-string').stringify
const getRandomInt = require('./utils').getRandomInt

exports.gelbooru = tags => {
    const config = {
        page: 'dapi',
        s: 'post',
        q: 'index',
        tags
    }
    https.get(`https://gelbooru.com/index.php?${stringify(config)}`, response => {
        let data = ''
        response.on('error', err => console.log(err))
        response.on('data', data_ => data += data_)
        response.on('end', () => {
            parser.parseString(data, (err, result) => {
                const randomPost = getRandomInt(1, result.posts.post.length)
                if (result.posts.post[randomPost - 1]) {
                    return `http:${result.posts.post[randomPost - 1].sample_url}`
                }
            })
        })
    })
}
