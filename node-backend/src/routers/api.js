const router = require('express').Router()
const request = require('request')
const cookie = require('cookie')
const jsdom = require("jsdom");
const dom2json = require('dom-to-json')
const { JSDOM } = jsdom;

router.post('/login', (req, res) => {

    const options = {
        url: 'https://cse.buet.ac.bd/moodle/login/index.php',
        form: {
            username: req.body.username,
            password: req.body.password,
        }
    }

    request.post(options, (error, response, body) => {
        if (error) {
            res.status(402).send()
        } else {
            const sesskey = cookie.parse(response.headers['set-cookie'][1])
            return res.status(200).send(sesskey)
        }
    })
})

router.get('/courses', (req, res) => {

    var cookie = request.cookie('MoodleSession=' + req.headers['sesskey'])


    const options = {
        url: 'https://cse.buet.ac.bd/moodle/my/index.php?mynumber=-2',
        'method': "GET",
        headers: {
            'Cookie': cookie
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            res.status(402).send("Session Expired")
        } else {
            const dom = new JSDOM(body);
            const list = dom.window.document.querySelectorAll('*[id^="course-"]')
            for (var i = 0; i < list.length; i++) {
                console.log(dom2json.toJSON(list[i]))
                console.log('\n')
            }
            res.send(body)
        }
    })
})

module.exports = router