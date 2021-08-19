const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expensesScheme = new Schema({
  whereSpent: String,
  howMuchSpent: Number
});

const Item = mongoose.model("items", expensesScheme);

const uri = "mongodb+srv://semyonivanov:semyonivanov@cluster0.6g7e8.mongodb.net/expenses?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports.getAllItems = async (req, res, next) => {
  Item.find().then(result => {
    res.send(result);
  });
};

module.exports.createNewItem = async (req, res, next) => {
  const body = req.body;
  if (body.hasOwnProperty('whereSpent') && body.hasOwnProperty('howMuchSpent')) {
    await Item.create({
      whereSpent: body.whereSpent,
      howMuchSpent: body.howMuchSpent
    });
    Item.find().then(result => {
      res.send(result);
    });
  } else {
    res.status(422).send('Error! Params not correct');
  }
};

module.exports.updateItem = async (req, res, next) => {
  const body = req.body;
  if (body.hasOwnProperty('whereSpent') || body.hasOwnProperty('howMuchSpent')) {
    await Item.updateOne({_id: body._id}, {...body});
  } else {
    res.status(422).send('Error! Params not correct');
  }
  Item.find().then(result => {
    res.send(result);
  });
};

module.exports.deleteItem = (req, res, next) => {
  if (!req.query.id) return res.status(422).send('Error! Params not correct');
  Item.deleteOne({_id: req.query._id}).then();
  Item.find().then(result => {
    res.send(result);
  });
};