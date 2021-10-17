
const express = require('express')
const path = require('path')
const http =  require('http')
const hbs = require('hbs')
require('./db/mongoose')
const multer = require('multer') // Declare Multer to Upload Videos.
const bodyParser = require('body-parser')
const cors = require("cors") // Enable 'fetch' to local api.

const projectRouters = require('./routers/projectrouters')
const video_obj = require('./models/videoStorage')
const socketio = require('socket.io')

const app = express()
const port = process.env.PORT

const server = http.createServer(app) // Refactoring the creation of the server for socketIO
const io = socketio(server)

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.json())   // I'm using it 'cause otherwise the req.body is undefinied.
app.use(cors())

// Variables / JSON objects.
const ratings = new Object() 
var positive = 0
var negative = 0
ratings.thumbsUp= positive
ratings.thumbsDown= negative
const CategoryObject = new Object()
CategoryObject.category = 'default'
const searchname = 'none'
// Indicates where the Project Routers are.
app.use(projectRouters)

// WebSockets.
io.on('connection', (socket) => {
    console.log('New WebSocket Connection')
    socket.emit('countUpdated', positive)

    // Listen to event for positive review
    socket.on('positiveReview', () => {
        positive++
        io.emit('countUpdated', positive) // Emits to all the clients
        ratings.thumbsUp = positive
        //console.log('Positive Reviews: ' , ratings.thumbsUp)
    })
    // Listen to event for negative review.
    socket.on('negativeReview', () => { //  Count Can not be negative.
        negative++
        io.emit('countUpdated', negative)
        ratings.thumbsDown = negative
        //console.log('Negative Reviews:  ', ratings.thumbsDown)
    })

    // Category selected.
    socket.emit('categorySelected', CategoryObject.category)

    socket.on('categorySelected', (category) => {
        CategoryObject.category = category
        console.log(CategoryObject.category)
        io.emit('categorySelected', category)
    })

    // Disconected.
    socket.on('disconnect', () => {
        io.emit('message','Session finished!')
    })
})

// Storage path for multer videos.
const storage = multer.diskStorage({
    destination: './public/videos',
    filename:  function(req, file, cb) {
        cb(null, file.originalname.split('.')[0]+'-'+Date.now()+path.extname(file.originalname),)
    }
})

// Init model with multer method. Filer de kind of file you are able to upload.
const videoUpload = multer({
    storage, 
    limits: {
        fileSize: 10000000 // Limited fileSize 10 MB max. 
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv|)$/)) {
            return cb(new Error('Please upload a valid video file'))
        } else {
            let newfile = file.originalname.split('.')[0]+'-'+Date.now()+path.extname(file.originalname)
            cb(null, newfile)
            console.log(newfile)
        }
    }
})

// Define method for being able to 'POST' a video.
app.post('/upload', videoUpload.single('video'),(req, res) => { 
    // Reset variables: In case there's another object selected being used.
    ratings.thumbsUp= 0
    ratings.thumbsDown= 0
    
    // The user must pick a category or it wont upload the video.
    if (CategoryObject.category == 'default' || CategoryObject.category == 'Select a category:') {
        throw new Error("Please select one of the available categories!!!")
    } else {
        // Merge JSON files to include the new variables inside the JSON.
        let JSON_FILE = Object.assign(req.file, CategoryObject, ratings)
        json_obj = JSON.stringify(JSON_FILE, null, '\t')
        const NewVideo = new video_obj(JSON_FILE)

        res.render('SuccessPage', {
            title: 'Success!',
            response: json_obj,
            name: 'Juan Jose Restrepo',
            description: "Video Upload completed !!"
        })
        // Save New Video.
        NewVideo.save() 
        // Reset variables: In case there's another object selected being used.
        CategoryObject.category = 'default'
    }
    }, (error, req, res, next) => {
        // error.message
        res.status(400).send({ error: "Please upload a video file!" }) // Error Handling.
    }
)

// Define Method for Patch: Update video ratings by his Id.
app.patch('/player/:id', async (req, res) => {
    try {
        const NewVideo = await video_obj.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
        
        if (!NewVideo) {
            return res.status(404).send()
        }
        res.send(NewVideo)
        
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

// Get video by his name originalname, but req must have a body.
// Get /listvideos?category=''
app.get('/listvideos/', (req, res) =>{
    video_obj.find({}).then((NewVideo) => { 
        const videoObjfound = NewVideo.find( ({ originalname }) => 
            originalname === req.body.originalname // Fetch the exact name of the video.
        ) 
        res.send(videoObjfound)
    }).catch((e) => {
        res.status(500).send(e)
    })
})


// Get video by his name LIKE, it means that it will match the videoname that better fits de input.
app.get('/namevideo/:filename', (req, res) => {
    video_obj.findOne({filename: { $regex: '.*' + req.params.filename + '.*' } }, (err, doc) => {
        if (!doc) {
            console.log("Video not found!")
            res.status(404)
            res.send(err)
        } else {
            res.send(doc)
        }
      })
})

// Query by categories.
app.get('/category/:category', (req, res) => {
    video_obj.find({ category: req.params.category }, {_id:0 , filename:1 , thumbsUp:1 , thumbsDown:1}, (err, doc) => {
        if (!doc) {
            console.log("Video not found!")
            res.status(404)
            res.send(err)
        } else {
            res.send(doc)
        }
    })
})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

