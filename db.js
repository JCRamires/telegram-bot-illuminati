const MongoClient = require('mongodb').MongoClient

const state = {
    db: null
}

exports.connect = function(done) {
    if (state.db) return done()

    MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
        if (err) return done(err)
        state.db = db
        done()
    })
}

exports.get = function() {
    return state.db
}

exports.close = function(done) {
    if (state.db) {
        state.db.close(err => {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}
