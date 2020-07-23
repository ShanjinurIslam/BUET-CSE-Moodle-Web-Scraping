const router = require('express').Router()
const request = require('request')
const cookie = require('cookie')
const jsdom = require("jsdom");
const dom2json = require('dom-to-json');
const { response } = require('express');
const { JSDOM } = jsdom;
const fs = require('fs')

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
            console.log(sesskey)
            return res.status(200).send({ sesskey: sesskey['MoodleSession'] })
        }
    })
})

router.get('/courses', (req, res) => {
    var cookie = request.cookie('MoodleSession=' + req.headers['sesskey']) //+ req.headers['sesskey'])

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

router.get('/courses/:id', (req, res) => {
    var cookie = request.cookie('MoodleSession=' + req.headers['sesskey'])

    const options = {
        url: 'https://cse.buet.ac.bd/moodle/course/view.php?id=' + req.params.id,
        'method': "GET",
        headers: {
            'Cookie': cookie
        }
    }

    request(options, (error, response, body) => {
        const dom = new JSDOM(body)

        const sections = dom.window.document.querySelectorAll('*[id^="section-"]')

        var object = new Object()

        var arr = []

        for (var i = 1; i < sections.length; i++) {

            const header = sections[i].querySelectorAll('[class="sectionname"]')[0]
            if (header == undefined) {
                continue
            }

            var temp = new Object()
            temp['week_name'] = header.innerHTML
            temp['resourses'] = []

            const activities = sections[i].querySelectorAll('[class="activityinstance"]')

            if (activities.length > 0) {
                for (var j = 0; j < activities.length; j++) {
                    var instance = new Object()
                    if (activities[j] == undefined) {
                        continue
                    } else {
                        const name = activities[j].querySelectorAll('[class="instancename"]')[0].innerHTML.split('<')[0]
                        const json = dom2json.toJSON(activities[j].querySelectorAll('a')[0])

                        instance['name'] = name
                        instance['href'] = json['attributes'][2][1]
                        instance['type'] = instance['href'].split("/")[5]
                        temp['resourses'].push(instance)
                    }
                }
            }

            arr.push(temp)
        }

        object['weeks'] = arr

        return res.send(object)
    })
})

router.get('/resource', (req, res) => {
    var cookie = request.cookie('MoodleSession=' + req.headers['sesskey'])

    const options = {
        url: req.headers['url'],
        'method': "GET",
        headers: {
            'Cookie': cookie
        }
    };

    /*
    request(options, (error, response, body) => {
        var fileName = response.headers['content-disposition'].split('=')[1].replace("\"", "")
        fileName = fileName.substr(0, (fileName.length) - 1)

        fs.access(fileName, fs.F_OK, (err) => {
            if (err) {
                fs.writeFileSync(fileName, body, 'binary', function(err) {
                    if (err) {
                        return console.error(err);
                    }
                })
                return res.status(200).download(fileName)
            }
            return res.status(200).download(fileName)
        })
    })*/

    request(options).on("response", (response) => {
        var fileName = response.headers['content-disposition'].split('=')[1].replace("\"", "")
        fileName = fileName.substr(0, (fileName.length) - 1)

        fs.access(fileName, fs.F_OK, (err) => {
            if (err) {
                var fws = fs.createWriteStream(fileName);
                response.pipe(fws)
            }
        })

        response.on('end', function() {
            return res.status(200).download(fileName)
        });
    })
})

router.get("/logout", (req, res) => {
    var cookie = request.cookie('MoodleSession=' + req.headers['sesskey']) //+ req.headers['sesskey'])

    const options = {
        url: 'https://cse.buet.ac.bd/moodle/login/logout.php',
        'method': "POST",
        headers: {
            'Cookie': cookie
        }
    };

    request(options, (error, response, body) => {
        const dom = new JSDOM(body);

        const logoutkey = dom2json.toJSON(dom.window.document.forms[0]).childNodes[0].childNodes[1].attributes[2][1]

        const options = {
            url: 'https://cse.buet.ac.bd/moodle/login/logout.php?sesskey=' + logoutkey,
            'method': "POST",
            headers: {
                'Cookie': cookie
            }
        };
        request(options, (error, response, body) => {
            if (error) {
                res.status(402).send()
            } else {
                console.log(response.statusCode)
                return res.status(200).send()
            }
        })
    })
})

module.exports = router