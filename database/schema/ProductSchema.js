const mongoose = require("mongoose")

const CommentsSchema = mongoose.Schema(
    {
        user_id : String,
        user_name : String,
        text : String,
        replay : String,
        id : String
    }
)

const ProductSchema = mongoose.Schema(
    {
        href : String,
        id_name : String, 
        name : String,
        images : [String],
        category_id : String, 
        price : Number,
        discount : Number,
        captions : String,
        count : Number,
        types : [String],
        feature : [String],
        likes : [String],
        comments : [CommentsSchema],
        lables : [String],
        sales : Number
    }
)

const Product = mongoose.model('product',ProductSchema)

module.exports.ProductModel = Product