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
exports.createOrUpdate = function (req, res, next) {

  var forum = req.body;

  console.log('createOrUpdate Forum');
  console.log(forum);

  Forum.findOneAndUpdate({forumUrl: forum.forumUrl}, forum, {upsert: true}, function (err, forum) {
    if (err) {
      console.log(err);
      return res.send(400);
    }
    console.log('updateded Forum:');
    console.log(forum);
    return res.json(forum);
  });

};


exports.remove = function (req, res, next) {


  var forumId = req.params.id;
  Forum.find({_id: forumId}).remove(function (err) {
    if (err) {
      console.log(err);
      return res.send(400);
    }
    res.send(200);
  });

};

