const mongoose = require("mongoose")

const QuestionSchema = mongoose.Schema(
    {
        question : String,
        answer : String
    }
)

const Question = mongoose.model('question',QuestionSchema)

module.exports.QuestionModel = Question