'use strict';

var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
    Schema = mongoose.Schema;

/**
 * Movie Schema
 */
var MovieSchema = new Schema({
  created_at: { type: Date},
  updated_at: { type: Date },
  title: {type: String, required: true},
  threadUrl: {type: String, required: true},
  forumId: {type: Number, required: true},
  fileName: String,
  thxLink: String,
  image: String,
  password: String,
  status: {type: String, required: true, default: 'download'},
  rating: Number,
  genres: [String]


});

//MovieSchema
//  .virtual('canDownload')
//  .get(function() {
//    return this.status === 'download';
//  });



mongoose.model('Movie', MovieSchema
);
