// packages

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const http = require('http')

// initialized app
var app = express()

// routers
const api = require('./routers/api')

// session
app.use(cookieParser())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, path: '/', maxAge: 245600 }
}))

// no cache
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

// bodyParser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// add routers to app
app.use('', api)

const server = http.createServer(app)
server.listen(3000, '127.0.0.1', function() {
    server.close(function() {
        server.listen(8080, '192.168.0.106')
    })
})