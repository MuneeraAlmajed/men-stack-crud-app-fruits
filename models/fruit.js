const mongoose = require('mongoose');

const fruitSchema = mongoose.Schema({
  name: String,
  isReadyToEat: Boolean,
});

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;