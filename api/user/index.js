const express = require("express");
const authentication = require("./authentication").authentication
const cart = require("./cart").cart
const userinfo = require("./userinfo").userinfo
const app = express.Router();

app.use("/authentication",authentication)

app.use("/cart",cart)

app.use("/userinfo", userinfo)

module.exports.user = app