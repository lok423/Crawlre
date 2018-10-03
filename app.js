
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

const News_URL = "https://educationcentral.co.nz/category/news/";
const Features_URL = "https://educationcentral.co.nz/category/features/";
const Opinion_URL = "https://educationcentral.co.nz/category/opinion/";
const Teaching_And_Learning_URL = "https://educationcentral.co.nz/category/teaching-and-learning/";
const Sectors_URL = "https://educationcentral.co.nz/category/sectors/";
const Future_URL = "https://educationcentral.co.nz/category/future-focus/";
var idCounter = 0;


(async()=>{
  //await crawlEducationCentral();
  console.log("after function");
  // PythonShell.run('./test.py', null, function (err, data) {
  //     if (err) console.log(err);
  //     console.log(data.toString())
  //   });
  var test = new PythonShell('test.py', options);
  test.on('message', function(message){
    console.log(message);
  });
})();

//crawlEducationCentral();

 async function crawlEducationCentral(){
   console.time("crawl");
   var news = Crawlre.execute('news', News_URL, idCounter);
   var features =   Crawlre.execute('features',Features_URL,idCounter);
   var opinion =   Crawlre.execute('opinion',Opinion_URL,idCounter);
   var teaching =  Crawlre.execute('teaching',Teaching_And_Learning_URL,idCounter);
  var sectors =  Crawlre.execute('sectors',Sectors_URL,idCounter);
    var future =  Crawlre.execute('future',Future_URL,idCounter);
  await Promise.all([news,features,opinion,teaching,sectors,future]).then(function(values) {
    //console.log(values);
    console.log("fetch finished");
    console.timeEnd("crawl");
    let data = JSON.stringify(values);
    fs.writeFileSync('articles.json', data);

  });
  console.log("after promise");
  return new Promise(function(resolve, reject){
    resolve('ok');
  });



}
