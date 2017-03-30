const https = require('https')
const stringify = require('query-string').stringify

const config = {
    part: 'contentDetails',
    channelId: process.env.YOUTUBE_CHANNEL_ID,
    key: process.env.YOUTUBE_API_KEY,
    maxResults: 1
}

exports.getLastVideo = (msg, botInstance) => {
    https.get(`https://www.googleapis.com/youtube/v3/activities/?${stringify(config)}`, response => {
        let data = ''
        response.on('error', err => console.log(err))
        response.on('data', data_ => data += data_)
        response.on('end', () => {
            const result = JSON.parse(data)
            if (result.items) {
                const videoId = result.items[0].contentDetails.upload.videoId
                if (videoId) {
                    botInstance.sendMessage(msg.chat.id, `https://www.youtube.com/watch?v=${videoId}`)
                }
            }
        })
    })
}
