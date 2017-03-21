var express = require('express');
var path    = require('path');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

//setupview engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req,res){

            res.render('index', {text:'hello'});

})


app.get('/scrape', function(req, res){
  url = 'http://malesbanget.com/';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var json = [];

    //   $('.title_wrapper').filter(function(){
    //     var data = $(this);
    //     title = data.children().first().text().trim();
    //     release = data.children().last().children().last().text().trim();
    //     json.title = title;
    //     json.release = release;
    //   })
    //   $('.ratingValue').filter(function(){
    //     var data = $(this);
    //     rating = data.text().trim();
    //     json.rating = rating;
    //   })

    //   $('.postTitlee').filter(function(){
    //     var data = $(this);
    //     title = data.text().trim();
    //     json.push(title);
    //   })
      
    //   $('#videoSection').filter(function(){
    //     var data = $(this);
    //     pic = data.find('img').attr('src');
    //     json.push(pic);       
    // })

      $('img').each(function (i, elem) {
          json.push({});
          json[i] = $(this).attr('src');
      });
    }
    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })
            // res.json(json);
             res.render('index', {text:'hello', images:json});
  })
});



///////////////////////////////////////////////////
// Tes SCRAPE data Pake "SCRAPE IT" library Node //
///////////////////////////////////////////////////


app.get('/osmosis', function(req, res){
  const scrapeIt = require("scrape-it");

    // Promise interface
    scrapeIt("http://ionicabizau.net", {
        title: ".header h1"
      , desc: ".header h2"
      , avatar: {
            selector: ".header img"
          , attr: "src"
        }
    }).then(page => {
        // console.log(page);
            fs.writeFile('output.json', JSON.stringify(page, null, 4), function(err){
          console.log('File successfully written! - Check your project directory for the output.json file');
        })
    });

    // Callback interface
    scrapeIt("http://ionicabizau.net", {
        // Fetch the articles
        articles: {
            listItem: ".article"
          , data: {

                // Get the article date and convert it into a Date object
                createdAt: {
                    selector: ".date"
                  , convert: x => new Date(x)
                }

                // Get the title
              , title: "a.article-title"

                // Nested list
              , tags: {
                    listItem: ".tags > span"
                }

                // Get the content
              , content: {
                    selector: ".article-content"
                  , how: "html"
                }
            }
        }

        // Fetch the blog pages
      , pages: {
            listItem: "li.page"
          , name: "pages"
          , data: {
                title: "a"
              , url: {
                    selector: "a"
                  , attr: "href"
                }
            }
        }

        // Fetch some other data from the page
      , title: ".header h1"
      , desc: ".header h2"
      , avatar: {
            selector: ".header img"
          , attr: "src"
        }
    }, (err, page) => {
        // console.log(err || page);
        fs.writeFile('output.json', JSON.stringify(page, null, 4), function(err){
          console.log('File successfully written! - Check your project directory for the output.json file');
        });
    });
});



app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;