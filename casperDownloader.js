var casper = require('casper').create();


var downloadUrl =casper.cli.get(0);
var fileName = casper.cli.get(1);

casper.start('http://www.usenetrevolution.info/vb/cmps_index.php?tabid=73?tabid=29', function() {
  this.evaluate(function(){
    var arr = document.getElementsByName("vb_login_username");
    var i;

    for (i = 0; i < arr.length; i++) {
      arr[i].value = "serverlat";
    }
    arr = document.getElementsByName("vb_login_password");

    for (i = 0; i < arr.length; i++) {
      arr[i].value = "Over9000";
    }

    arr = document.getElementById("navbar_loginform");
    arr.submit();

    return arr;
  });
});

casper.then(function() {
  this.download(downloadUrl, '/nzb/'+fileName);

});
casper.run();
