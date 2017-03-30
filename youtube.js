const https = require('https')
const stringify = require('query-string').stringify

const getRandomInt = require('./utils').getRandomInt

exports.getLastVideo = (msg, botInstance) => {
    const config = {
        part: 'contentDetails',
        channelId: process.env.YOUTUBE_CHANNEL_ID,
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 1
    }

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

const configStatusMongolices = {
    part: 'status',
    playlistId: process.env.YOUTUBE_PLAYLIST_ID,
    key: process.env.YOUTUBE_API_KEY
}
function getStatusMongolice() {
    let response
    https.get(`https://www.googleapis.com/youtube/v3/playlistItems/?${stringify(configStatusMongolices)}`, result => {
        let data = ''
        result.on('error', err => console.log(err))
        result.on('data', data_ => data += data_)
        result.on('end', () => response = JSON.parse(data))
    })

    return response
}

exports.getMongolice = (msg, botInstance) => {
    const status = getStatusMongolice()
    console.log(status)
    const pages = Math.floor(status.pageInfo.totalResults)
    const randomPage = getRandomInt(1, pages)
    const config = {
        part: 'contentDetails',
        playlistId: process.env.YOUTUBE_PLAYLIST_ID,
        key: process.env.YOUTUBE_API_KEY
    }
    let pageToken
    for (let i = 0; i < randomPage; i = i + 1) {
        config.pageToken = pageToken
        https.get(`https://www.googleapis.com/youtube/v3/playlistItems/?${stringify(config)}`, response => {
            let data = ''
            response.on('error', err => console.log(err))
            response.on('data', data_ => data += data_)
            response.on('end', () => {
                const result = JSON.parse(data)
                if (i == randomPage - 1) {
                    const randomVideoNumber = getRandomInt(1, result.items.length)
                    botInstance.sendMessage(msg.chat.id, `https://www.youtube.com/watch?v=${result.items[randomVideoNumber].contentDetails.videoId}`)
                } else {
                    pageToken = result.nextPageToken
                }
            })
        })
    }

}
