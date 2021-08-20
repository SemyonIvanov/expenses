const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expensesScheme = new Schema({
  whereSpent: String,
  howMuchSpent: Number
});

const Item = mongoose.model("items", expensesScheme);

const uri = "mongodb+srv://semyonivanov:semyonivanov@cluster0.6g7e8.mongodb.net/expenses?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const total = collection => {
  let result = 0;
  collection.forEach(item => {
    result += item.howMuchSpent;
  });
  return result;
}

module.exports.getAllItems = async (req, res, next) => {
  Item.find().then(result => {
    res.send({
      body: result,
      total: total(result)
    });
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
      res.send({
        body: result,
        total: total(result)
      });
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
    res.send({
      body: result,
      total: total(result)
    });
  });
};

module.exports.deleteItem = async (req, res, next) => {
  if (!req.query.id) return res.status(422).send('Error! Params not correct');
  await Item.deleteOne({_id: req.query.id}).then();
  Item.find().then(result => {
    res.send({
      body: result,
      total: total(result)
    });
  });
};