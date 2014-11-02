var phantom = require('phantom');

phantom.create(function (ph) {
  ph.createPage(function (page) {
    page.open("http://www.usenetrevolution.info/vb/cmps_index.php?tabid=73?tabid=29", function (status) {

      page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
        page.evaluate(function() {
          $("button").click();
        });
        phantom.exit()
      });



      console.log("opened google? ", status);
      page.evaluate(function () { return document.title; }, function (result) {
        console.log('Page title is ' + result);
        ph.exit();
      });
    });
  });
});
