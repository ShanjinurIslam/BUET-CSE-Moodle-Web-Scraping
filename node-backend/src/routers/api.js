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
			
			//const activities = sections[i].querySelectorAll('[class="activityinstance"]')
            const activities = sections[i].querySelectorAll('[class="activity "]')

            if (activities.length > 0) {
                for (var j = 0; j < activities.length; j++) {
                    var instance = new Object()
                    if (activities[j] == undefined) {
                        continue
                    } else {
                        const name = activities[j].querySelectorAll('[class="instancename"]')[0].innerHTML.split('<')[0]
                        const json = dom2json.toJSON(activities[j].querySelectorAll('a')[0])
						const description = activities[j].querySelectorAll('p')[0]
						
                        instance['name'] = name
                        instance['href'] = json['attributes'][2][1]
                        instance['type'] = instance['href'].split("/")[5]
                        temp['resourses'].push(instance)
						if(description!=undefined){
							desc = description.innerHTML
							instance['desc'] = desc
						}
                    }
                }
            }

            arr.push(temp)
        }

        object['weeks'] = arr

        return res.send(object)
    })
})

router.get('/sitenews', (req, res) => {
    //var cookie = request.cookie('MoodleSession=' + req.headers['sesskey']) // We don't need the sesskey to retrieve the site news! 

    const options = {
        url: 'https://cse.buet.ac.bd/moodle/mod/forum/view.php?id=114',
        'method': "GET",
        headers: {
           // 'Cookie': cookie
        }
    };
	 request(options, (error, response, body) => {
        if (error) {
            res.status(401).send({ message: "Session Expired" })
        } else {
            const dom = new JSDOM(body)
			const pages = dom.window.document.querySelectorAll('div.paging')[0].querySelectorAll('a')
		
			var objects = new Object();
			var sitenews = []
			const news = dom.window.document.querySelectorAll('*[class^="discussion"]');
			for(i=0;i<news.length;i++){
				var object = new Object();
				object['topic'] = news[i].querySelectorAll('[class="topic starter"]')[0].querySelectorAll('a')[0].innerHTML
				object['id'] = news[i].querySelectorAll('[class="topic starter"]')[0].querySelectorAll('a')[0].href.split('=')[1]
				object['author'] = news[i].querySelectorAll('[class="author"]')[0].querySelectorAll('a')[0].innerHTML
				object['topic'] = news[i].querySelectorAll('[class="topic starter"]')[0].querySelectorAll('a')[0].innerHTML
				object['time'] = news[i].querySelectorAll('[class="lastpost"]')[0].querySelectorAll('a')[1].innerHTML
				
				sitenews.push(object);
			}
			/*var objects = new Object(); // It will be used to fetch the other 3 pages.
			for(i=0;i<pages.length-1;i++){
				objects[i] = pages[i].href;
			}*/
			
			objects['sitenews'] = sitenews;
            res.status(200).send({ sitenews })
        }
    })
})

router.get('/sitenews/:id', (req, res) => {
    //var cookie = request.cookie('MoodleSession=' + req.headers['sesskey']) //+ req.headers['sesskey'])

    const options = {
        url: 'https://cse.buet.ac.bd/moodle/mod/forum/discuss.php?d='+req.params.id,
        'method': "GET",
        headers: {
           // 'Cookie': cookie
        }
    };
	 request(options, (error, response, body) => {
        if (error) {
            res.status(401).send({ message: "Session Expired" })
        } else {
            const dom = new JSDOM(body)
			const forumposts = dom.window.document.querySelectorAll('[class^="forumpost"]');
			//console.log(forumposts.length);
			var posts = [];
			for(i=0;i<forumposts.length;i++){
				var object = new Object();
				object['title'] = forumposts[i].querySelectorAll('[class="subject"]')[0].innerHTML;
				//console.log(object['title']);
				object['author'] = forumposts[i].querySelectorAll('[class="author"] a')[0].innerHTML;
				object['time'] = forumposts[i].querySelectorAll('[class="author"]')[0].innerHTML.split('-')[1];
				object['desc'] = forumposts[i].querySelectorAll('[class="posting fullpost"]')[0].innerHTML;
				var attachments = [];
				const attach = forumposts[i].querySelectorAll('[class="attachments"] a');
				if( attach!=undefined){
					for(j=1;j<attach.length;j+=2){
						var attachobject = new Object();
						attachobject['title'] = attach[j].innerHTML;
						attachobject['link'] = attach[j].href;
						attachments.push(attachobject);
					}
				}
				object['attachments'] = attachments;
				posts.push(object);
			}
			
            res.status(200).send({ posts })
        }
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