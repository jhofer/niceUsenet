'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  Schema = mongoose.Schema;

var DbPatchSchema = new Schema({
  index: {type: Number, required: true, unique: true},
  text: {type: String, required: true}
});

mongoose.model('DbPatch', DbPatchSchema);

var patches = [];

module.exports.addPatch = function (index, text, execute) {
    patches.push({index: index,
                  text: text,
                  execute: execute
  });

};

var DbPatch = mongoose.model('DbPatch');


var executePatch = function (index, text, execute) {
  var patchObject = new DbPatch({index: index, text: text});
  patchObject.save(function (err) {
    if (err) {
      console.log('patch '+text+' with the index "' + index + '" already executed!');
    } else {
      console.log('execute patch '+text+' with the index "' + index + '" ');
      try{
        execute();
      }catch(err){
        patchObject.remove();
        throw err;
      }
    }
  });
};

module.exports.applyDelta  = function(){
  patches = _.sortBy(patches, 'index');
  patches.forEach(function(patch){
    executePatch(patch.index, patch.text, patch.execute);
  });

};
