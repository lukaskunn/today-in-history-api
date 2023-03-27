const express = require("express")
const DateController = require("../controllers/dateController.js")

const dateRouter = express.Router()

dateRouter
    .get("/:language/:day/:month", DateController.getWikipediaData)
    .get("/:language/today", DateController.getWikipediaData)

module.exports = dateRouter