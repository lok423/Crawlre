
const Crawlre =  require('./crawlre/crawlre.js');


const News_URL = "https://educationcentral.co.nz/category/news/";
const Features_URL = "https://educationcentral.co.nz/category/features/";
const Opinion_URL = "https://educationcentral.co.nz/category/opinion/";
const Teaching_And_Learning_URL = "https://educationcentral.co.nz/category/teaching-and-learning/";
const Sectors_URL = "https://educationcentral.co.nz/category/sectors/";
const Future_URL = "https://educationcentral.co.nz/category/future-focus/";
var idCounter = 0;



crawlEducationCentral();

 async function crawlEducationCentral(){
   console.time("crawl");
   var news = Crawlre.execute('news', News_URL, idCounter);
   var features =   Crawlre.execute('features',Features_URL,idCounter);
   var opinion =   Crawlre.execute('opinion',Opinion_URL,idCounter);
   var teaching =  Crawlre.execute('teaching',Teaching_And_Learning_URL,idCounter);
  var sectors =  Crawlre.execute('sectors',Sectors_URL,idCounter);
    var future =  Crawlre.execute('future',Future_URL,idCounter);
  Promise.all([news,features,opinion,teaching,sectors,future]).then(function(values) {
    console.log(values);
    console.log("end");
    console.timeEnd("crawl");
  });

}
