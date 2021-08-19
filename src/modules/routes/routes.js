const express = require('express');
const router = express.Router();

const {
  getAllItems,
  createNewItem,
  updateItem,
  deleteItem
} = require('../controllers/item.controller');

// Tasks routes
router.get('/', getAllItems);
router.post('/createNewItem', createNewItem);
router.patch('/updateItem', updateItem);
router.delete('/deleteItem', deleteItem);

//User routes

module.exports = router;