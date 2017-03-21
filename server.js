var express = require('express');
var bodyParser = require('body-parser');
var path    = require('path');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

//setupview engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')))




app.get('/', function(req,res){
    res.render('home');
})
app.post('/scrape', function(req, res){
  // get the url
  url = req.body.url;
  // made the request
  request(url, function(error, response, html){
    if(!error){
      // simple declaration
      var $ = cheerio.load(html);
      var json = [];
      // get src attribute in img tag 
      $('img').each(function (i, elem) {
          json.push({});
          json[i] = $(this).attr('src');
      });
    }
    // json file export
    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })
            // res.json(json);
             res.render('index', {text:'hello', images:json, url:url});
  })
});






app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;