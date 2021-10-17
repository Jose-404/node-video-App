const mongoose  = require('mongoose')
const Schema = mongoose.Schema

// mongoose.connect('mongodb://127.0.0.1:27017/video-app-db',{
//     useNewUrlParser: true,
//     // userFindAndModify: false ---> deprecated
//     // useCreateIndex: true ---> deprecated
// })

let videoStorage_Schema = new Schema({
    fieldname: {
        type: String,
        required: true,
        trim: true
    },
    originalname: {
        type: String,
        required: true,
        trim: true
    },
    encoding: {
        type: String,
        required: true,
        trim: true
    },
    mimetype: {
        type: String,
        required: true,
        trim: true  
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    filename: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    size: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    thumbsUp: {
        type: Number,
        required: true
    },
    thumbsDown: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const video_obj = mongoose.model('videoStorage', videoStorage_Schema)

module.exports = video_obj

