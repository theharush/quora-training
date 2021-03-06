"use strict";
var mongoose = require("mongoose"),
  Question = mongoose.model("Questions"),
  FilterTags = mongoose.model("FilterTags");

//controller for fetching last 10 questions from DB
exports.getQuestions = function(req, res) {
  Question.find()
    .sort({ created_date: -1 })
    .limit(10)
    .exec(function(err, questions) {
      if (err) res.send(err);
      res.json(questions);
    });
};

//controller for fetching last 10 questions after a given date from DB
exports.getQuestionsbyDateAndTag = function(req, res) {
  let { FilterTag, lastQuestionDate } = req.query;
  const query =
    FilterTag === "All"
      ? { created_date: { $lt: lastQuestionDate } }
      : { created_date: { $lt: lastQuestionDate }, tag: FilterTag };
  Question.find(query)
    .sort({ created_date: -1 })
    .limit(10)
    .exec(function(err, questions) {
      if (err) res.send(err);
      res.json(questions);
    });
};

//controller for fetching a random question from DB
exports.getQuestion = function(req, res) {
  Question.findById(req.params.questionId, function(err, question) {
    if (err) res.send(err);
    else res.json(question);
  });
};

//controller for posting a new question.
exports.postQuestion = function(req, res) {
  var question = new Question(req.body);
  question.save(function(err, question) {
    if (err) {
      res.send(err);
    } else {
      var tag = new FilterTags({ tag: req.body.tag });
      tag.save(err => {
        if (err) res.send(err);
        else res.send(question);
      });
    }
  });
};

//controller for posting an answer on a question
exports.postAnswer = function(req, res) {
  Question.findById(req.params.questionId, function(err, question) {
    if (err) res.send(err);
    var answer = { answer: req.body.answer, name: req.user.name };
    question.answers.push(answer);
    question.save(function(err, updatedQuestion) {
      if (err) res.send(err);
      res.send(updatedQuestion);
    });
  });
};

//controller for getting all filter tags on DB
exports.getFilterTags = function(req, res) {
  FilterTags.find().exec(function(err, FilterTags) {
    if (err) res.send(err);
    res.json(FilterTags);
  });
};
