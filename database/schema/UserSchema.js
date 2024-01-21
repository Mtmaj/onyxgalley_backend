const mongoose = require("mongoose")
const CartHistory = mongoose.Schema(
    {
        product_id : String,
        count : Number,
        type_product : Number
    }
)

const BuyHistory = mongoose.Schema(
    {
        product_id : String,
        count : Number,
        buy_time : Date,
        type_product : String,
        status : Number
    }
)
const UserSchema = mongoose.Schema(
    {
        phone_number: String,
        firstname : String,
        lastname : String,
        email : String,
        postal_code : String,
        address : String,
        auth_code : String,
        date_auth_code : Date,
        auth_cookie : String,
        cart_history : [CartHistory],
        buy_history : [BuyHistory]
    }
)

const User = mongoose.model('user',UserSchema)

module.exports.UserModel = User



