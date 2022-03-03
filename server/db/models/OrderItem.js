const Sequelize = require('sequelize');
const { Module } = require('webpack');
const db = require('../db');

const OrderItem = db.define('order_item', {
  quantity: {
    type: Sequelize.INTEGER,
  },
  price: {
    type: Sequelize.INTEGER,
  },
});

module.exports = OrderItem;
