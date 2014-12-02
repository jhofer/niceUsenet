'use strict';

var mongoose = require('mongoose'),
    Forum = mongoose.model('Forum'),
    passport = require('passport');


/**
 *  Get a list of forums
 */
exports.list = function (req, res, next) {
  return Forum.find(function (err, forums) {
    if (!err) {
      return res.json(forums);
    } else {
      return res.send(err);
    }
  });
};

/**
 * create or update forum
 */
exports.createOrUpdate = function(req, res, next) {
  var forum = req.forum;
  var forumId = forum._id;
  forum._id = undefined;

  Forum.update({_id: forumId}, forum, {upsert: true}, function(err){
    if (err) return res.send(400);
    res.send(200);
  });

};

