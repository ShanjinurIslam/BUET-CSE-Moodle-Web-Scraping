const router = require('express').Router()
const request = require('request')
const cookie = require('cookie')
const jsdom = require("jsdom");
const dom2json = require('dom-to-json')
const { JSDOM } = jsdom;

router.post('/login', (req, res) => {
    /*
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
            console.log(sesskey)
            return res.status(200).send({ sesskey: sesskey['MoodleSession'] })
        }
    })*/

    res.send({ sesskey: "ar4qvh9u8d38i2v9m67sjmkn41" })
})

router.get('/courses', (req, res) => {
    var cookie = request.cookie('MoodleSession=ar4qvh9u8d38i2v9m67sjmkn41') //+ req.headers['sesskey'])

    const options = {
        url: 'https://cse.buet.ac.bd/moodle/my/index.php?mynumber=-2',
        'method': "GET",
        headers: {
            'Cookie': cookie
        }
    };


    request(options, (error, response, body) => {
        if (error) {
            res.status(401).send({ message: "Session Expired" })
        } else {
            const dom = new JSDOM(body);
            const list = dom.window.document.querySelectorAll('*[id^="course-"]')
            var courses = []

            for (var i = 0; i < list.length; i++) {
                var json = dom2json.toJSON(list[i])
                var assingments = list[i].querySelectorAll('*[class="assign overview"]')
                var objects = []

                for (var j = 0; j < assingments.length; j++) {
                    var temp = Object()

                    var assignment_details = dom2json.toJSON(assingments[j])
                    var assignment_node = assignment_details.childNodes[0].childNodes[1]
                    var due_date = assignment_details.childNodes[1].childNodes[0]

                    temp['title'] = assignment_node.childNodes[0].nodeValue
                    temp[assignment_node.attributes[1][0]] = assignment_node.attributes[1][1]
                    temp['due_date'] = due_date.nodeValue.replace("Due date: ", "")
                    objects.push(temp)
                }

                var object = new Object()

                if (json['childNodes'].length > 1) {
                    var title_node = json.childNodes[0].childNodes[0].childNodes[0]
                    object[json.attributes[0][0]] = parseInt(json.attributes[0][1].replace("course-", ""))
                    object[title_node.attributes[0][0]] = title_node.attributes[0][1]
                    object['course_code'] = title_node.attributes[0][1].split(' ')[2].substr(0, 6)
                    object[title_node.attributes[1][0]] = title_node.attributes[1][1]
                    object['assignments'] = objects
                    courses.push(object)
                }
            }

            res.status(200).send({ courses })
        }
    })
})

module.exports = router