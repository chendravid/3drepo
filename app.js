//init stuff
var express = require('express');
var app = require("express")(); 
var bodyParser = require("body-parser"); 
var path = require('path');
const https = require('https');

//general vars
var id;

//github data vars
var stars;
var forks;
var openIssues;
var subscribers;


//init node app
app.use(express.static(path.join(__dirname, "build")));

//get heroku port or use localhost
var port = process.env.PORT || 8080;

//Set view engine to ejs
app.set("view engine", "ejs"); 

//Tell Express where we keep our index.ejs
app.set("views", __dirname + "/views"); 

//Use body-parser
app.use(bodyParser.urlencoded({ extended: false })); 


app.get('/p', function(req, res) {
    
    //get url query as repo url
    var id = req.query.repourl;
    var repoPath = id.replace("https://github.com/", "");

    var options = {
        host: 'api.github.com',
        path: '/repos/' + repoPath,
        method: 'GET',
        headers: {'user-agent': 'node.js'}
    };

    //get response from GitHub
    var request = https.request(options, function(response){
        var body = '';
        response.on("data", function(chunk){
            body += chunk.toString('utf8');
        });
        
        response.on("end", function(){
            var obj = JSON.parse(body);
            stars = obj.stargazers_count;
            forks = obj.forks_count;
            openIssues = obj.open_issues;
            subscribers = obj.subscribers_count;
            });
        });
        
        request.end();

        //render the EJS with parameters from response
       res.render('index', { starsCount: stars, forksCount:forks, openIssuesCount:openIssues, subscribersCount:subscribers, repoName:repoPath });
});

//run server
app.listen(8080, () => { console.log("Server online on port"+ port); });

//usage - enter a github repo url after p? , like:
//http://localhost:8080/p?repourl=https://github.com/github/view_component