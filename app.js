const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = 8080

app.use(bodyParser.json());

app.get('/', function (req, res) {
    var file = path.join(__dirname + '/atlassian-connect.json');
    res.sendFile(file);
});


app.get('/postInstallPage', (req, res) => {
    
    request({
        uri: `https://x-pipes.vsts.me/configuration/jira?xdm_e=${req.query['xdm_e']}&jwt=${req.query['jwt']}`, 
        method: 'GET',
        headers: {
            'user-agent': 'akbar'
        }
    }, function (error, response, body) {
            res.send(body);
    });
})

app.post('/event', (req, res) => {
    
    request({
        uri: 'https://x-pipes.vsts.me/_apis/public/Pipelines/Events?api-version=5.0-preview.1&provider=jiraconnectapp', 
        method: 'POST',
        headers: {
            'user-agent': 'akbar',
            'Content-Type': 'application/json',
            'authorization': req.headers['authorization']
        }, 
        body: JSON.stringify(req.body)
    }, function (error, response, body) {
        if (error) {
            console.log("Event failed");
            res.sendStatus(400);
        }
        else {
            res.sendStatus(200);
        }
    });
    //res.sendStatus(200);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
