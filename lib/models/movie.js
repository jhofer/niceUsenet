'use strict';

var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
    Schema = mongoose.Schema;

/**
 * Movie Schema
 */
var MovieSchema = new Schema({
  name: {type: String, required: true},
  imagePath: String,
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
