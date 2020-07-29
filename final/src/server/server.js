const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let path = require('path');

/* Server Setup */
const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// Cors for cross origin allowance
app.use(express.static('dist'));


//Endpoint
let projectData = {};


//Get route
app.get('/', function (req, res) {
  res.sendFile('dist/index.html')
})
// Post Route

app.post('/add', addInfo);

function addInfo(req, res) {
  projectData['depCity']= req.body.depCity;
  projectData['arrCity']= req.body.arrCity;
  projectData['depDate']= req.body.depDate;
  projectData['weather']= req.body.weather;
  projectData['summary']= req.body.summary;
  projectData['daysLeft']= req.body.daysLeft;
  res.send(projectData);
}

// Setup Server


const port = 7070;

// Spin up th server
const server = app.listen(port, listening);

// Callback function for listen, initialize in console that the server is running and the contents of localhost:7070
function listening() {
  console.log(`Server is running on localhost:${port}`);
};



