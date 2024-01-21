const express = require("express")
const cookie_valid = require("./authentication").cookie_valid
const UserModel = require("../../database/schema/UserSchema").UserModel
const email_valid = require("email-validator")
const { ProductModel } = require("../../database/schema/ProductSchema")
const app = express.Router()

app.post('/update',async (req,res) =>{
    const phone_number = req.headers.phone_number
    const auth_cookie = req.headers.auth_cookie
    if(cookie_valid(phone_number,auth_cookie)){
        var update_user = await UserModel.findOne({phone_number:phone_number})
        if(email_valid.validate(req.body.email) || req.body.email == ""){
            if(req.body.post_code == "" || req.body.post_code.length == 10){
                update_user.firstname = req.body.firstname;
                update_user.lastname = req.body.lastname;
                update_user.email = req.body.email;
                update_user.postal_code = req.body.post_code;
                update_user.address = req.body.address;
                update_user.save()
                return res.status(200).json({status : "اطلاعات با موفقیت ثبت شد"})
            }else{
                return res.status(400).json({status:"کد پستی درست نیست"})
            }
        }else{
            return res.status(400).json({status:"ایمیل درست نیست"})
        }
    }
    return res.status(200).json({status : "اعتبارسنجی اشتباه است"})
    
})

app.get('/get',async (req,res)=>{
    const phone_number = req.headers.phone_number
    const auth_cookie = req.headers.auth_cookie
    if(cookie_valid(phone_number,auth_cookie)){
        const user = await UserModel.findOne({phone_number:phone_number})
        console.log(user)
        var list_product = []
        await asyncForEach(user.buy_history, async (element) =>{
            const product = await ProductModel.findById(element.product_id)
            list_product.push(
                {
                    product : product,
                    count : element.count,
                    buy_time : element.buy_time,
                    type_product : element.type_product,
                    status : element.status
                }
            )
        });
        var res_json = {
            phone_number:phone_number,
            firstname : user.firstname,
            lastname : user.lastname,
            email : user.email,
            postal_code : user.postal_code,
            address : user.address,
            list_product : list_product
        }
        return res.status(200).json(res_json)
    }
    return res.status(401).json({status:"user not authentication !!!"})
})

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
}

module.exports.userinfo = app