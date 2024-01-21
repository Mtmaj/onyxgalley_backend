const express = require("express");
const { ProductModel } = require("../../database/schema/ProductSchema");
const { countryPhoneData } = require("phone");
const cookie_valid = require('./authentication').cookie_valid
const UserModel = require("../../database/schema/UserSchema").UserModel;

const app = express.Router()

app.get("/add",async (req,res)=>{
    const phone_number = req.headers.phone_number;
    if(await cookie_valid(phone_number,req.headers.auth_cookie)){
        const product_id = req.headers.product_id;
        const index_type_product = req.headers.index_type;
        var user = await UserModel.findOne({phone_number:phone_number});
        var is_found = false;
        user.cart_history.forEach(element => {
            if(element.product_id == product_id && element.type_product == index_type_product){
                element.count += 1;
                is_found = true;
                return false
            }
            return true
        });
        if(!is_found){
            user.cart_history.push({
                product_id : product_id,
                count : 1,
                type_product : index_type_product
            })
        }
        user.save()
        return res.status(200).json({status : "محصول به سبد خرید اضافه شد"})
    }
    return res.status(401).json({status : "خطا در اعتبار سنجی"})
})

app.get("/get",async (req,res)=>{
    const phone_number = req.headers.phone_number;
    const auth_cookie = req.headers.auth_cookie;
    if(await cookie_valid(phone_number,auth_cookie)){
        const user = await UserModel.findOne({phone_number:phone_number})
        var list_cart = user.cart_history;
        var list_res = []
        for(var i = 0;i<list_cart.length;i++){
            const product = await ProductModel.findById(list_cart[i].product_id)
            list_res.push(
                {
                    product : product,
                    product_id : list_cart[i].product_id,
                    count : list_cart[i].count,
                    type_product : list_cart[i].type_product
                }
            )
        }

        return res.status(200).json(list_res)
    }

    return res.status(401).json({status:"user not authentication!!!"})
})

app.get("/remove-product",async (req,res)=>{
    const phone_number = req.headers.phone_number;
    const auth_cookie = req.headers.auth_cookie;
    if(await cookie_valid(phone_number,auth_cookie)){
        var user = await UserModel.findOne({"phone_number" : phone_number})
        user.cart_history.map((item,index)=>{
            if(item.product_id == req.headers.product_id && item.type_product == req.headers.index_type){
                user.cart_history.splice(index,1);
                return false
            }
            return true
        })
        user.save()
        return res.status(200).json({status : "محصول حذف شد"})
    }
    return res.status(401).json({status:"اعتبار سنجی انجام نشد"})
})

app.get("/remove",async (req,res)=>{
    const phone_number = req.headers.phone_number;
    const auth_cookie = req.headers.auth_cookie;
    if(await cookie_valid(phone_number,auth_cookie)){
        var user = await UserModel.findOne({"phone_number" : phone_number})
        user.cart_history.map((item,index)=>{
            if(item.product_id == req.headers.product_id && item.type_product == req.headers.index_type){
                if(item.count < 2){
                    user.cart_history.splice(index,1);
                }else{
                    user.cart_history[index].count -= 1;
                }
                return false
            }
            return true
        })
        user.save()
        return res.status(200).json({status : "محصول حذف شد"})
    }
    return res.status(401).json({status:"اعتبار سنجی انجام نشد"})
})

app.get("/get-one", async (req,res)=>{
    const phone_number = req.headers.phone_number;
    const auth_cookie = req.headers.auth_cookie;
    if(await cookie_valid(phone_number,auth_cookie)){
        const user = await UserModel.findOne({"phone_number" : phone_number})
        var count = 0
        user.cart_history.map((item,index)=>{
            if(item.product_id == req.headers.product_id && item.type_product == req.headers.index_type){
                count = item.count
                return false
            }
            return true
        })
        return res.status(200).json({count:count})
    }
    return res.status(401).json({status:"اعتبار سنجی انجام نشد"})
})

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
}

module.exports.cart = app