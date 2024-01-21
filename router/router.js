const express = require("express")
const product_list = require("../api/product_list/index").product_list
const user = require("../api/user/index").user
const product = require("../api/product/index").product
const category = require('../api/category/index').category
const questions  = require("../api/questions").questions
const morgan = require('morgan');

const app = express.Router()
app.use(morgan('dev'))

app.use('/user',user)

app.use('/product',product)

app.use('/category',category)

app.use('/product-list',product_list)

app.use('/questions',questions)

module.exports.router = app