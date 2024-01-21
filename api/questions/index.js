const express = require("express")
const { Admin } = require("../admin/authentication")
const QuestionModel = require("../../database/schema/QuestionSchema").QuestionModel

const app = express.Router()

app.get('/get',async (req,res)=>{
    const data = await QuestionModel.find()
    return res.status(200).json(data)
})

app.post("/add",async (req,res)=>{
    const username = req.headers.username
    const password = req.headers.password
    const my_admin = new Admin(username,password)
    if(await my_admin.valid_request()){
        const new_question = QuestionModel(
            {
                question : req.body.title,
                answer : req.body.answer
            }
        )
        await new_question.save()
        return res.status(200).json({status : "سوال متداول جدید اضافه شد"})
    }
    return res.status(401).json({status:"اعتبارسنجی با خطا رو به رو شد"})
})

app.put('/update',async (req,res)=>{
    const username = req.headers.username
    const password = req.headers.password
    const my_admin = new Admin(username,password)
    if(await my_admin.valid_request()){
        var update_question = await QuestionModel.findById(req.body.question_id)
        update_question.question = req.body.title
        update_question.answer = req.body.answer
        await update_question_question.save()
        return res.status(200).json({status : "سوال نتداول تغییر کرد"})
    }
    return res.status(401).json({status:"اعتبارسنجی با خطا رو به رو شد"})
})

app.get('/get-one',async (req,res)=>{
    const data = await QuestionModel.findById(req.headers.question_id)
    return res.json(data)
})

app.get('/remove',async (req,res)=>{
    const username = req.headers.username
    const password = req.headers.password
    const my_admin = new Admin(username,password)
    if(await my_admin.valid_request()){
        await QuestionModel.findByIdAndDelete(req.headers.question_id)
        return res.status(200).json({status : "سوال نتداول تغییر کرد"})
    }
    return res.status(401).json({status:"اعتبارسنجی با خطا رو به رو شد"})
})

module.exports.questions = app