const express = require("express")
const Admin = require("../admin/authentication").Admin
const CategoryModel = require("../../database/schema/CategorySchema").CategoryModel
const ProductModel = require("../../database/schema/ProductSchema").ProductModel
const app = express.Router()

app.post('/add',async (req,res)=>{
    const admin = new Admin(req.headers.username,req.headers.password)
    if(await admin.valid_request()){
        const new_category = CategoryModel({
            id_name : req.body.id_name,
            name : req.body.name
        })
        await new_category.save()
        return res.status(200).json({status : "New Category Added"})
    }
    return res.status(401).json({status : "Not Authentication"})
})

app.get('/get',async (req,res)=>{
    const list_category = await CategoryModel.find()
    res.json(list_category)
})

app.post('/update',async (req,res)=>{
    const admin = new Admin(req.headers.username,req.headers.password)
    if(await admin.valid_request()){
        const update_category = CategoryModel.findOne({id_name : req.body.id_name})
        update_category.id_name = req.body.id_name;
        update_category.name = req.body.name;
        await update_category.save()
        return res.status(200).json({status : "Updated Category"})
    }
    return res.status(401).json({status : "Not Authentication"})
})

app.get('/remove',async (req,res)=>{
    const admin = new Admin(req.headers.username,req.headers.password)
    if(await admin.valid_request()){
        const remove_category = await CategoryModel.findOne({id_name : req.body.id_name})
        const remove_id = remove_category.id
        await ProductModel.deleteMany({category_id : remove_id})
        return res.status(200).json({status : "Updated Category"})
    }
    return res.status(401).json({status : "Not Authentication"})
})

module.exports.category = app