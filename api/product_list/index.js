const express = require("express")
const search = require("./search").search
const sort = require("./sort").sort

const app = express.Router()

app.use("/sort",sort)

app.use("/search", search)

module.exports.product_list = app