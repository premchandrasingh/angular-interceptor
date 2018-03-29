let express = require('express');
let app = express();
let router = express.Router();
let http = require('http');
let bodyParser = require('body-parser');
let cors = require('cors');

let util = require('./server-util');
let middlewares = require('./server-middleware');


///////  MIDDLEWARES    /////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
///////  MIDDLEWARES - END   /////////

// respond with "hello world" when a GET request is made to the homepage
router.get('/', function (req, res) {
  res.json({ message: 'Hello World' })
})

router.post('/token', function (req, res) {
  // simulating a little delay
  setTimeout(() => {
    if (req.body.grant_type == 'password') {
      util.login(req, res);
    } else if (req.body.grant_type == 'refresh_token') {
      console.log(`refresh_token at ${new Date()}`)
      util.refreshToken(req, res);
    } else {
      res.json({ status: 400, message: 'Invalida grant type' })
    }
  }, 1000);
})

router.get('/samplecall', middlewares.authorize, function (req, res) {
  res.json({ status: 200, payload: { message: `/samplecall successful at ${new Date()}` } })
})

router.get('/samplecall2', middlewares.authorize, function (req, res) {
  res.json({
    status: 200, payload: {
      books: [
        "Pro MERN Stack: Full Stack Web App Development with Mongo, Express, React, and Node Paperback",
        "React Quickly",
        "ng-book: The Complete Guide to Angular4",
        "Getting MEAN with Mongo, Express, Angular, and Node",
        "React Native for iOS Development",
        "Pro ASP.NET Core MVC"]
    }
  })
})


app.use("/api/v1/", router);
app.use("/", function (req, res) {
  res.json({ message: 'API HOME. Actual endpoints are after /api/v1/' })
});

var _server = http.createServer(app);
_server.listen(4445, function () {
  console.log(`API server listening to http://localhost:4445`);
});
