'use strict';


var request = require('request').defaults({jar: true}),
_ = require('underscore-node'),
cheerio = require('cheerio'),
j = request.jar();
var EventEmitter = require('events').EventEmitter;

module.exports = new EventEmitter();
console.log("load usenet");



 console.log('define'+ 'acceptForumRules');

function acceptForumRules(){
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
        console.log("accpet rule responed"+ httpResponse.statusCode );

       module.exports.emit('ready');

    });
}

 console.log('define'+ 'readForumRules');

function readForumRules(){

    request({url:'http://www.usenetrevolution.info/vb/misc.php?do=vsarules&doredir=1&cfrset=1', jar: j},function(){
  // callback.send(html);
  acceptForumRules();

});

}

 console.log('define'+ 'login');

function login(){

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

    readForumRules();

});



}

 console.log('define'+ 'acceptRules');


function acceptRules(okLink){
    console.log('akzept and call'+ okLink);
    request(
    {
        url : okLink,
        jar: j

    },function(){
        login();
    });
}




 console.log('make first request');

request(
{
    url : 'http://www.usenetrevolution.info',
    jar: j,
}, function(err, response, html){

      console.log('caled'+ 'http://www.usenetrevolution.info');
    var $ = cheerio.load(html);
    var links =[];
    $('a').each(function(i, element){
        var link = $(element);
        links.push(link.attr('href'));

    });


    var okLink = _.find(links,function(link){
        return  link.indexOf('cmps_index.php') > -1;
    });


    acceptRules(okLink);
});


module.exports.requestForumThreads =  function requestForumThreads(forumId, callback){


 request({url:'http://www.usenetrevolution.info/vb/forumdisplay.php?f='+forumId, jar: j},function(err, response, html){



    var $ = cheerio.load(html);
    var threads = [];
    $('.threadinfo').each(function(i, element){
        var image = $(element).find('a.threadstatus img.preview').attr('src');
        var title = $(element).find('.inner h3 a.title').html();
        if(title && 
            title.indexOf('Postingregeln') === -1){
        threads.push({
            image: image,
            title: title,
            imdb: '',
            raiting: ''
        });
        }
    });

    console.log("callback will be called");
    callback(threads);

});
}

//EXPORTS

