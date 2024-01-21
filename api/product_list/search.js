const express = require("express")
const { ProductModel } = require("../../database/schema/ProductSchema")
const { CategoryModel } = require("../../database/schema/CategorySchema")

const app = express.Router()

app.post("/", async (req,res)=>{
    const list_product = await ProductModel.find()
    const searchString = req.body.search
    console.log(searchString)
    var list_response = []
    for(var i = 0;i<list_product.length;i++){
        const element = list_product[i];
        const category = await CategoryModel.findById(element.category_id)
        const category_name = category.name
        if(element.name.includes(searchString) || category_name.includes(searchString) ||  element.lables.indexOf(searchString) > -1){
            list_response.push(element)
        }
    }
    res.status(200).json(list_response)
})

module.exports.search = app