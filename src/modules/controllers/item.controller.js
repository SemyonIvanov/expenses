const uniqid = require('uniqid');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskScheme = new Schema({
  text: String,
  isCheck: Boolean
});

const Task = mongoose.model("tasks", taskScheme);

const uri = "mongodb+srv://semyonivanov:semyonivanov@cluster0.6g7e8.mongodb.net/TODOlist?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports.getAllTasks = async (req, res, next) => {
  Task.find().then(result => {
    res.send(result);
  });
};

module.exports.createNewTask = async (req, res, next) => {
  const body = req.body;
  if (body.hasOwnProperty('text') && body.hasOwnProperty('isCheck')) {
    await Task.create({
      text: body.text,
      isCheck: body.isCheck
    });
    Task.find().then(result => {
      res.send(result);
    });
  } else {
    res.status(422).send('Error! Params not correct');
  }
};

module.exports.changeTaskInfo = async (req, res, next) => {
  const body = req.body;
  if (body.hasOwnProperty('text') || body.hasOwnProperty('isCheck')) {
    // await Task.updateOne({_id: body.id}, {text: body.text, isCheck: body.isCheck});
    await Task.updateOne({_id: body.id}, {...body});
  } else {
    res.status(422).send('Error! Params not correct');
  }
  Task.find().then(result => {
    res.send(result);
  });
};

module.exports.deleteTask = (req, res, next) => {
  if (!req.query.id) return res.status(422).send('Error! Params not correct');
  Task.deleteOne({_id: req.query.id}).then();
  Task.find().then(result => {
    res.send(result);
  });
};