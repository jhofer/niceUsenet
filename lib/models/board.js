'use strict';

var mongoose = require('mongoose'),
	  validators = require('mongoose-validators'),
    Schema = mongoose.Schema;

/**
 * Movie Schema
 */
var ForumSchema = new Schema({
  title: {type: String, required: true},
  forumUrl: {type: String, required: true}
});

mongoose.model('Forum', ForumSchema);


//
///**
// * Movie Schema
// */
//var BoardSchema = new Schema({
//  title: {type: String, required: true},
//  username: {type: String, required: true},
//  password: {type: String, required: true}
//});
//
//
//mongoose.model('Board', BoardSchema
//);
