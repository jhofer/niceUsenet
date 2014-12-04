'use strict';

var mongoose = require('mongoose'),
  passport = require('passport');


exports.create = function (modelName) {
  var Model = mongoose.model(modelName);
  /**
   * return a object with the curd function for the given Model
   */
  return {
    /**
     *  Get a list of forums
     */
    list: function (req, res, next) {
      Model.find(function (err, forums) {
        if (err) {
          console.log(err);
          return res.send(400);
        }
        return res.json(forums);
      });
    },


    get: function (req, res, next) {
      var modelId = req.params.id;
      Model.findOne({_id: modelId}, function (err, forum) {
        if (err) {
          console.log(err);
          return res.send(400);
        }
        return res.json(forum);
      });
    },


    /**
     * create or update forum
     */
    create: function (req, res, next) {
      Model.create(req.body, function (err, forum) {
        if (err) {
          console.log(err);
          return res.send(400);
        }
        return res.json(forum);
      });
    },


    update: function (req, res, next) {
      var modelId = req.params.id;
      console.log(modelId);
      var model = req.body;
      console.log(model);

      Model.findOneAndUpdate({_id: modelId}, model, function (err, updatedModel) {
        if (err) {
          console.log(err);
          return res.send(400);
        }
        console.log(updatedModel);
        return res.json(updatedModel);
      });

    },

    delete: function (req, res, next) {


      var modelId = req.params.id;
      Model.find({_id: modelId}).remove(function (err) {
        if (err) {
          console.log(err);
          return res.send(400);
        }
        res.send(200);
      });

    }
  };
};
