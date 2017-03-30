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

exports.getMongolice = (msg, botInstance) => {
    const configStatusMongolices = {
        part: 'status',
        playlistId: process.env.YOUTUBE_PLAYLIST_ID,
        key: process.env.YOUTUBE_API_KEY
    }
    https.get(`https://www.googleapis.com/youtube/v3/playlistItems/?${stringify(configStatusMongolices)}`, result => {
        let data = ''
        result.on('error', err => console.log(err))
        result.on('data', data_ => data += data_)
        result.on('end', () => {
            const status = JSON.parse(data)

            const pages = Math.floor(status.pageInfo.totalResults / 50)
            const randomPage = getRandomInt(1, pages)

            const config = {
                part: 'contentDetails',
                playlistId: process.env.YOUTUBE_PLAYLIST_ID,
                key: process.env.YOUTUBE_API_KEY,
                maxResults: 50
            }
            let pageToken
            for (let i = 0; i < randomPage; i = i + 1) {
                let messageSent = false
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
                            messageSent = true
                        } else {
                            pageToken = result.nextPageToken
                        }
                    })
                })

                if (messageSent) { break }
            }
        })
    })
}
