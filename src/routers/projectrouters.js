const express = require('express')
const path = require('path')

const router = new express.Router()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Uploads',
        name: 'Juan Jose Restrepo',
        description: 'Use this site to upload your favorite Video!',
    })
})

router.get('/player', (req, res) => {
    res.render('player', {
        title: 'Watch Your Favorite Videos!',
        name: 'Juan Jose Restrepo',
        description: req.body.originalname
    })
})

router.get('/categories', (req, res) => {
    res.render('categories', {
        title: 'Categories',
        name: 'Juan Jose Restrepo',
        description:"Available categories"
    })
})

module.exports = router
