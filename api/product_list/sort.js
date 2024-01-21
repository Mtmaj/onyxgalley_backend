const express = require("express");
const ProductModel = require("../../database/schema/ProductSchema").ProductModel;

const app = express()

app.get('/bestsellers',async (req,res)=>{
    const category_id = req.headers.category_id;
    console.log(req.body)
    var list_product = [];
    if(category_id != null){
        list_product = await ProductModel.find({category_id:category_id}).sort({sales:-1})
    }else{
        list_product = await ProductModel.find().sort({sales:-1})
    }
    return res.status(200).json(list_product)
})

app.get('/expensive',async (req,res)=>{
    const category_id = req.headers.category_id;
    var list_product = [];
    if(category_id != null){
        list_product = await ProductModel.find({category_id:category_id}).sort({price:-1})
    }else{
        list_product = await ProductModel.find().sort({price:-1})
    }
    return res.status(200).json(list_product)
})

app.get('/discounts',async (req,res)=>{
    const category_id = req.headers.category_id;
    var list_product = [];
    if(category_id != null){
        list_product = await ProductModel.find({category_id:category_id,discount:{$ne:0}}).sort({discount:-1})
    }else{
        list_product = await ProductModel.find({discount:{$ne:0}}).sort({price:-1})
    }
    return res.status(200).json(list_product)
})

app.get('/favarites',async (req,res)=>{
    const category_id = req.headers.category_id;
    var list_product = [];
    if(category_id != null){
        list_product = await ProductModel.find({category_id:category_id}).sort({likes:-1})
    }else{
        list_product = await ProductModel.find().sort({likes:-1})
    }
    return res.status(200).json(list_product)
})

app.get('/cheap',async (req,res)=>{
    const category_id = req.headers.category_id;
    var list_product = [];
    if(category_id != null){
        list_product = await ProductModel.find({category_id:category_id}).sort({price:1})
    }else{
        list_product = await ProductModel.find().sort({price:1})
    }
    return res.status(200).json(list_product)
})

app.get('/',async (req,res)=>{
    const category_id = req.headers.category_id;
    var list_product = [];
    if(category_id != null){
        list_product = await ProductModel.find({category_id:category_id})
    }else{
        list_product = await ProductModel.find()
    }
    return res.status(200).json(list_product)
})

module.exports.sort = app