const mongoose = require("mongoose")

const CategorySchame = mongoose.Schema(
    {
        id_name : String,
        name : String
    }
)

const Category = mongoose.model('category',CategorySchame)

module.exports.CategoryModel = Category