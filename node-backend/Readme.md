# Node.js backend

Packages used in this project:

1. expressjs
2. bodyParser
3. cookieParser
4. session
5. http
6. request


API Documentation:

POST /LOGIN
BODY : username and password
Returns: sesskey

GET /Courses
Header: sesskey
Returns: List of courses

GET /courses/:id
Header: sesskey
returns: Array of weeks

GET /resource
Header: Resource url,sesskey
returns: ppt/pdf/file reponse

GET /logout
Header: sesskey
returns: status code
