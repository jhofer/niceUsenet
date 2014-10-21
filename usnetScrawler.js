'use strict';


    var request = require('request').defaults({jar: true}),
     _ = require('underscore-node'),
     cheerio = require('cheerio'),
     j = request.jar();


function requestHDMovies(callback){
 request({url:'http://www.usenetrevolution.info/vb/forumdisplay.php?f=39', jar: j},function(err, response, html){



   var $ = cheerio.load(html);
    var threads = [];
   $('.threadinfo').each(function(i, element){
      var image = $(element).find('a.threadstatus img.preview').attr('src');
      var title = $(element).find('.inner h3 a.title').html();
      threads.push({
         image: image,
         title: title,
         imdb: '',
         raiting: ''
      });
   });


   callback(threads);



 });
}

function acceptForumRules(callback){
      request.post(
          {
             url:'http://www.usenetrevolution.info/vb/misc.php?do=vsaafragree',
             jar: j,
             form: {
               cfrset:'1',
               cafr_agree:'1',
               vsaafr_counter:'Abschicken'
             }
         },
         function(err,httpResponse){
           console.log("login respone"+ httpResponse.statusCode );

           requestHDMovies(callback);

         });
}

function readForumRules(callback){

request({url:'http://www.usenetrevolution.info/vb/misc.php?do=vsarules&doredir=1&cfrset=1', jar: j},function(){
  // callback.send(html);
   acceptForumRules(callback);

 });

}

function login(callback){

 console.log('now login');

 request.post(
       {
          url:'http://www.usenetrevolution.info/vb/login.php',
          jar: j,
          form: { vb_login_username:'serverlat',
          vb_login_password:'Over9000'
       }
      },
      function(err,httpResponse,body){
        console.log('login respone'+ httpResponse.statusCode );

        readForumRules(callback);

      });



}



function acceptRules(callback, okLink){
     console.log('akzept and call'+ okLink);
        request(
         {
          url : okLink,
          jar: j

       },function(){
            login(callback);
       });
}




module.exports.getUsenetContent = function (callback){

 request(
 {
    url : 'http://www.usenetrevolution.info',
    jar: j,
}, function(err, response, html){


  var $ = cheerio.load(html);
  var links =[];
  $('a').each(function(i, element){
    var link = $(element);
    links.push(link.attr('href'));

 });


  var okLink = _.find(links,function(link){
    return  link.indexOf('cmps_index.php') > -1;
    });


   acceptRules(callback,okLink);
   });
};