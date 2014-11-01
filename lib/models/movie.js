'use strict';

var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
    Schema = mongoose.Schema;

/**
 * Movie Schema
 */
var MovieSchema = new Schema({
  title: {type: String, required: true},
  threadUrl: {type: String, required: true},
  forumId: {type: Number, required: true},

  image: String,
  password: String,
  downloaded: Boolean,
  raiting: Number,
  genres: [String]
});

/**
 * Validations
*/





mongoose.model('Movie', MovieSchema
);
