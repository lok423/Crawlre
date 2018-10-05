
const Crawlre =  require('./crawlre/crawlre.js');
const fs = require('fs');
const {PythonShell} = require("python-shell");
const options = {
  mode: 'text',
  encoding: 'utf-8',
  pythonOptions: ['-u'],
  scriptPath: './',
  args: ['hello world'],
  pythonPath: '/usr/bin/python'
};
const schedule = require('node-schedule');
console.time("read file");
var file = fs.readFileSync('last_page.json', 'utf8');
//var article_file = fs.readFileSync('last_page.json', 'utf8');
// var content =  JSON.parse(article_file);
var article_content=null;
fs.readFile('articles.json', function (err, data) {
    article_content = JSON.parse(data);
})
console.timeEnd("read file");




const News_URL = "https://educationcentral.co.nz/category/news/";
const Features_URL = "https://educationcentral.co.nz/category/features/";
const Opinion_URL = "https://educationcentral.co.nz/category/opinion/";
const Teaching_And_Learning_URL = "https://educationcentral.co.nz/category/teaching-and-learning/";
const Sectors_URL = "https://educationcentral.co.nz/category/sectors/";
const Future_URL = "https://educationcentral.co.nz/category/future-focus/";

function scheduleCronstyle(){
    schedule.scheduleJob('0 0 8 * * *', function(){
     //schedule.scheduleJob('1-10 * * * * *', function(){
        console.log('scheduleCronstyle:' + new Date());
        (async()=>{
          await crawlEducationCentral();
          // PythonShell.run('./test.py', null, function (err, data) {
          //     if (err) console.log(err);
          //     console.log(data.toString())
          //   });
          // var test = new PythonShell('test.py', options);
          // test.on('message', function(message){
          //   console.log(message);
          // });
        })();
    });
}

//scheduleCronstyle();

(async()=>{
  var last_url = JSON.parse(file);
  await crawlEducationCentral(last_url);
  console.log("end");
  //run Python
  // PythonShell.run('./test.py', null, function (err, data) {
  //     if (err) console.log(err);
  //     console.log(data.toString())
  //   });
  // var test = new PythonShell('test.py', options);
  // test.on('message', function(message){
  //   console.log(message);
  // });
})();



 async function crawlEducationCentral(last_url){
   console.time("crawl");
   var news = Crawlre.execute('news', News_URL,last_url);
   var features =   Crawlre.execute('features',Features_URL,last_url);
   var opinion =   Crawlre.execute('opinion',Opinion_URL,last_url);
   var teaching =  Crawlre.execute('teaching',Teaching_And_Learning_URL,last_url);
  var sectors =  Crawlre.execute('sectors',Sectors_URL,last_url);
    var future =  Crawlre.execute('future',Future_URL,last_url);
  await Promise.all([news,features,opinion,teaching,sectors,future]).then(function(values) {
    console.timeEnd("crawl");
    console.log("processing data");
    for (var i=0;i<values.length;i++){
      if(values[i]){
        console.log("push index: ",i,", ",values[i].length, "articles");
        for(var j=0;j<values[i].length;j++){
          article_content[i].push(values[i][j]);
        }
      }
    }
    let data = JSON.stringify(article_content);
    fs.writeFileSync('articles.json', data);

  });
  console.log("finished processing");
  return new Promise(function(resolve, reject){
    resolve('ok');
  });
}
