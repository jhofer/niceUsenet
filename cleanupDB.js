mongoose = require('mongoose');

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});


return Moive.find(function (err, movies) {
  movies.forEach(function(movie){
      movie.status = 'download';
      movie.save();
    });
});
