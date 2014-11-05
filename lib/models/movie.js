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
  rating: Number,
  genres: [String],
  created_at: { type: Date },
  updated_at: { type: Date }

});

/**
 * Validations
*/

MovieSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});



mongoose.model('Movie', MovieSchema
);
