var request = require('request');
var cheerio = require('cheerio');
const {Article} = require('../models/article.model');
var URL = require('url-parse');
const util = require('util');
const EventEmitter = require('events');



  function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    return(bodyText.indexOf(word.toLowerCase()) !== -1);
  }

  function collectInternalLinks($) {
      var relativeLinks = $("a[href^='/']");
      //console.log("Found " + relativeLinks.length + " relative links on page");
      relativeLinks.each(function() {
          pagesToVisit.push(baseUrl + $(this).attr('href'));
      });
  }


module.exports.execute = execute;

  async function execute(_category, _url,_id){

    var category = _category;
    var idCounter = _id;
    var url = _url;
    var pagesVisited = {};
    var numPagesVisited = 0;
    var pagesToVisit = [];
    var article_array=[];
    var a ;
    var no_more_article = false;
    const MAX_PAGES_TO_VISIT = 10;

    //console.log(idCounter);
    pagesToVisit.push(url);
    //console.log(pagesToVisit);
    //const asyncFunction = util.promisify(crawl());




    // let articles
    //  try {
    //    articles =  crawl()
    //  } catch (err) {
    //    logger.error(' error', err)
    //    //return res.status(500).send()
    //  }
    //crawl();




      async  function crawl(pages) {

      //var category = category;
      if(pagesToVisit.length==0){
        //console.log("no page to visit");
          return;

      }
      if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
        //console.log("Reached max limit of number of pages to visit.");
        return Promise.resolve(article_array);
      }
      var nextPage = pagesToVisit.pop();
      if (nextPage in pagesVisited) {
        // We've already visited this page, so repeat the crawl
        crawl(pages);
      } else {
        // New page we haven't visited
        await visitPage(nextPage).then(async function(data){
          await getData(data,crawl);
          //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
        });




      }
      return  await crawl(pages);


      //console.log("hhhhhhhhhhhhhhh");
//       return new Promise(function(resolve,reject){
//         console.log(pagesToVisit.length, numPagesVisited);
//         if(pagesToVisit.length==0 && numPagesVisited>1){
// resolve(article_array);
// //myEE.emit('foo');
// }
//         });


    }

     function visitPage(url, callback) {
      // Add page to our set
      pagesVisited[url] = true;
      numPagesVisited++;
      //console.log(category);

      // Make the request
      return new Promise(function(resolve, reject){
        console.log("Visiting page " + url);
        request(url, function(error, response, body) {
           // Check status code (200 is HTTP OK)
           //console.log("Status code: " + response.statusCode);
           if(response.statusCode !== 200) {
             callback();
              reject(error);
           }else{
             resolve(body);
           }
             });
             });
           }


           function getData(body,callback){
           // Parse the document body
           var $ = cheerio.load(body);
           if(numPagesVisited==1){
             var highlight = $('.td_block_inner').first().children();
             highlight.find('a').each(function(i,item){
               ////console.log($(this).attr('href'));
               var href = $(this).attr('href');
               if(!(pagesToVisit.includes(href))){
                 pagesToVisit.push(href);
               }
             });
           }else{
             //console.log(numPagesVisited);
      var article_content=[];
      $('.td-post-content p').each(function(i,item){
        //console.log(item);
        //console.log($(this).html());
        article_content.push($(this).html());
      });

      //console.log(article_content);

             var article_title = $('.entry-title').first().text();
             var sub_title = $('.td-post-sub-title').text();
             var author_name = $('.td-post-author-name a').text();
             var article_date = $('.td-post-date').first().text();
             //var id = idCounter;
             let article = new Article(idCounter,category, article_title, sub_title, author_name, article_date, article_content);
             idCounter++;
             //console.log(article);
             article_array.push(article);

           }
           //console.log(pagesToVisit);

            //callback();
           //console.log("i'm here");
           return new Promise(function (resolve, reject){
             resolve('ok');
           })
    }

    // function result(data){
    //   return new Promise(function(resolve,reject){
    //     resolve(data);
    //   })
    // }
//console.log("//////////////////////")
    var result =   await crawl(pagesToVisit);
    //myEE.on('foo', () => console.log('a'));

    //console.log("aaaaaaaaaaa");

    return article_array

  }
