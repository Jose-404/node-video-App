const mongoose  = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    // userFindAndModify: false ---> deprecated
    // useCreateIndex: true ---> deprecated
})
