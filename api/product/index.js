const express = require("express")
const { cookie_valid } = require("../user/authentication")
const Admin = require("../admin/authentication").Admin
const ProductModel = require("../../database/schema/ProductSchema").ProductModel
const app = express.Router()
const { v4: uuidv4 } = require('uuid');
const { CategoryModel } = require("../../database/schema/CategorySchema")
const { UserModel } = require("../../database/schema/UserSchema")
const axios = require("axios")
const crypto = require("crypto")
const FormData = require("form-data")

app.post('/add',async (req,res)=>{
    const admin_username = req.headers.username
    const admin_password = req.headers.admin_password
    const CheckAdmin = new Admin(admin_username,admin_password);
    const data_product = req.body  
    if(await CheckAdmin.valid_request()){
        const category = await CategoryModel.findById(data_product.category_id)
        const category_href = category.id_name
        var img_list = data_product.images
        console.log(img_list)
        var img_links = []
        for(var i = 0;i<img_list.length;i++){
            var token = uuidv4();
            var expire = parseInt(Date.now()/1000)+2400;
            var privateAPIKey = "private_q6cHirTVZl6vqvpc87K/ZASrE7M=";
            var signature = crypto.createHmac('sha1', privateAPIKey).update(token+expire).digest('hex');
            var form = new FormData();
            form.append("file",img_list[i])
            form.append("publicKey","public_7Yn/jDBO0TlMx9GfQhYELxKMS+c=")
            form.append("signature",signature)
            form.append("expire",expire)
            form.append("token",token)
            form.append("fileName","post_image")
            try{
                var response = await axios.post("https://upload.imagekit.io/api/v1/files/upload",form)
                console.log(response.data.thumbnailUrl)
                img_links.push(response.data.thumbnailUrl)
            }catch(e){
                console.log("Upload faild : ",e)
            }
        }
        const new_product = ProductModel(
            {
                href : category_href + "/" + data_product.id_name,
                id_name : data_product.id_name,
                name : data_product.name,
                category_id : data_product.category_id, 
                price : data_product.price,
                discount : data_product.discount,
                captions : data_product.captions,
                count : data_product.count,
                types : data_product.list_types,
                feature : data_product.list_feature,
                likes : [],
                comments : [],
                lables : data_product.lables,
                images: img_links,
                sales : 0
            }
        )
        new_product.save();
        return res.status(200).json({status:"New Product Added !!!"})
    }
    return res.status(401).json({status : "Your Acount not authentication Admin !!! "})
})


app.get('/like',async (req,res)=>{
    const phone_number = req.headers.phone_number;
    const auth_cookie = req.headers.auth_cookie;
    if(await cookie_valid(phone_number,auth_cookie)){
        const product_id = req.headers.product_id;
        var product = await ProductModel.findById(product_id)
        if(product != null){
            product.likes.indexOf(phone_number) > -1?product.likes.splice(product.likes.indexOf(phone_number),1):product.likes.push(phone_number)
            product.save();
            return res.status(200).json({status : "Product Liked !!!"})
        }else{
            return res.status(404).json({status : "Product Not found !!!"})
        }
    }
    return res.status(401).json({status : "User Not Authentication !!!"})
})

app.post('/update',async (req,res)=>{
    const admin_username = req.headers.username
    const admin_password = req.headers.admin_password
    const CheckAdmin = new Admin(admin_username,admin_password);
    const data_product = req.body
    if(await CheckAdmin.valid_request()){
        var img_list = data_product.images
        console.log(img_list)
        var img_links = []
        for(var i = 0;i<img_list.length;i++){
            var token = uuidv4();
            var expire = parseInt(Date.now()/1000)+2400;
            var privateAPIKey = "private_q6cHirTVZl6vqvpc87K/ZASrE7M=";
            var signature = crypto.createHmac('sha1', privateAPIKey).update(token+expire).digest('hex');
            var form = new FormData();
            form.append("file",img_list[i])
            form.append("publicKey","public_7Yn/jDBO0TlMx9GfQhYELxKMS+c=")
            form.append("signature",signature)
            form.append("expire",expire)
            form.append("token",token)
            form.append("fileName","post_image")
            try{
                var response = await axios.post("https://upload.imagekit.io/api/v1/files/upload",form)
                console.log(response.data.thumbnailUrl)
                img_links.push(response.data.thumbnailUrl)
            }catch(e){
                console.log("Upload faild : ",e)
            }
        }
        var product_update = await ProductModel.findOne({id_name:req.body.id_name})
        product_update.id_name = data_product.id_name;
        product_update.name = data_product.name;
        product_update.category_id = data_product.category_id; 
        product_update.price = data_product.price;
        product_update.discount = data_product.discount;
        product_update.captions = data_product.captions;
        product_update.count = data_product.count;
        product_update.types = data_product.list_types;
        product_update.feature = data_product.list_feature;
        product_update.lables = data_product.lables;
        product_update.images = img_links;
        product_update.save();
        return res.status(200).json({status:"Updated Product Added !!!"})
    }
    return res.status(401).json({status : "Your Acount not authentication Admin !!! "})
})

app.get('/get',async (req,res)=>{
    const product = await ProductModel.findOne({id_name:req.body.id_name})
    res.status(200).json(product)
})

app.get('/delete',async (req,res)=>{
    const admin_username = req.headers.username
    const admin_password = req.headers.admin_password
    const CheckAdmin = new Admin(admin_username,admin_password);
    if(await CheckAdmin.valid_request()){
        const remove_product = await ProductModel.deleteOne({id_name:req.headers.id_name})  
        return res.status(200).json({status:"Remove Product Added !!!"})
    }
    return res.status(401).json({status : "Your Acount not authentication Admin !!! "})
})

app.get("/get-all", async (req,res)=>{
    const product_list = await ProductModel.find()
    res.status(200).json(product_list)
})

app.post("/comment",async (req,res)=>{
    const phone_number = req.headers.phone_number;
    const auth_cookie = req.headers.auth_cookie;
    if(await cookie_valid(phone_number,auth_cookie)){
        const product_id = req.headers.product_id;
        var product = await ProductModel.findById(product_id)
        var user = await UserModel.findOne({phone_number:phone_number})
        product.comments.push(
            {
                user_id : user.id,
                user_name : user.firstname + " " + user.lastname,
                text : req.body.text,
                id : uuidv4(),
                replay:""
            }
        )
        product.save()
        return res.status(200).json({status : "نظر شما ثبت شد"})
    }
    return res.status(401).json({status : "User Not Authentication !!!"})
})

app.get("/replay-comment",async (req,res)=>{
    const admin_username = req.header.username
    const admin_password = req.header.admin_password
    const CheckAdmin = new Admin(admin_username,admin_password);
    if(await CheckAdmin.valid_request()){
        var product_update = await ProductModel.findOne({id_name:req.body.id_name})
        for(var i = 0;i<product_update.comments.length;i++){
            if(product_update.comments[i].id == req.body.comment_id){
                product_update.comments[i].replay = req.body.replay;
                break;
            }
        }
        
        return res.status(200).json({status:"Replay Added !!!"})
    }
    return res.status(401).json({status : "Your Acount not authentication Admin !!! "})
})

app.get("/get-url",async (req,res)=>{
    const category_id = req.headers.category_id;
    const product_id = req.headers.product_id;
    const category = await CategoryModel.findOne({id_name:category_id});
    if(category != null){
        const product = await ProductModel.findOne({id_name:product_id});
        if(product != null){
            return res.status(200).json(product)
        }
    }
    return res.status(404).json({status:"Page Not Found"})

})


module.exports.product = app