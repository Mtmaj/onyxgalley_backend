const express = require("express");
const UserModel = require("../../database/schema/UserSchema").UserModel;
const app = express.Router();
const { v4: uuidv4 } = require('uuid');
const {phone} = require('phone');
const { default: axios } = require("axios");
const { config } = require("process");

app.get('/auth',async (req,res)=>{
    const phone_number = req.headers.phone_number;
    const phone_valid = phone(phone_number,{country:"IR"})
    if(!phone_valid.isValid){
        res.status(401).json({status:"شماره را صحیح وارد کنید ..."})
        return
    }
    var user = await UserModel.findOne({phone_number:phone_number})
    if(user == null){
        const auth_code = Math.floor(Math.random()*100000) + 10000;
        send_sms(auth_code,phone_number)
        const new_user = UserModel({
            phone_number: phone_number,
            firstname : '',
            lastname : '',
            email : '',
            postal_code : '',
            address : '',
            auth_code : auth_code,
            date_auth_code : Date.now(),
            auth_cookie : uuidv4(),
            cart_history : [],
            buy_history : []
        });
        new_user.save();
    }else{
        if(Math.abs(Date.now() - user.date_auth_code) / 1000 > 120 ){
            const auth_code = Math.floor(Math.random()*100000) + 10000;
            send_sms(auth_code,phone_number)
            user.auth_code = auth_code;
            user.date_auth_code = Date.now();
            user.save();
        }
    }
    res.json({status : "کد تایید ارسال شد."})
})


function send_sms(auth_code,phone_number){
    const https = require('https');
    var aut_string = auth_code.toString()
    const data = JSON.stringify({
        'bodyId': 150020,
        'to': phone_number,
        'args': [aut_string]
    });

    const options = {
        hostname: 'console.melipayamak.com',
        port: 443,
        path: '/api/send/shared/ef6c987939f0455bbcb455f381cb9bf0',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, res => {
        console.log('statusCode: ' + res.statusCode);

        res.on('data', d => {
            process.stdout.write(d)
        });
    });

    req.on('error', error => {
        console.error(error);
    });

    req.write(data);
    req.end();
}

app.get("/auth-code-valid",async (req,res)=>{
    const phone_number = req.headers.phone_number
    var auth_code = req.headers.auth_code
    if(auth_code == 0){
        auth_code = -1;
    }
    var user = await UserModel.findOne({phone_number:phone_number,auth_code:auth_code})
    if(user != null){
        if((Math.abs(Date.now() - user.date_auth_code) / 1000) <= 120 ){
            user.auth_code = 0
            user.date_auth_code = null
            user.save()
            res.status(200).json(
                {
                    status : "کد تایید تایید شد",
                    phone_number : user.phone_number,
                    auth_cookie : user.auth_cookie
                }
            )
            return
        }else{
            user.auth_code = 0
            user.date_auth_code = null
            user.save()
            res.status(401).json(
                {
                    status : "کد تایید شما باطل شده است",
                }
            )
            return
        }
    }else{
        res.status(401).json(
            {
                status : "کد تایید وارد شده اشتباه است.",
            }
        )
        return
    }
})

app.get("/cookie-validator",async (req,res)=>{
    const phone_number = req.headers.phone_number;
    const auth_cookie = req.headers.auth_cookie;
    const is_auth = await valid_cookie(phone_number,auth_cookie)
    if(is_auth){
        res.status(200).json(
            {
                status:"Login is Valid"
            }
        )
        return
    }
    res.status(401).json(
        {
            status : "Login is Not Ok"
        }
    )

})



async function valid_cookie(phone_number,auth_cookie){
    const user = await UserModel.findOne({phone_number : phone_number,auth_cookie:auth_cookie})
    if(user != null){
        return true
    }
    return false
    
}

module.exports.authentication = app
module.exports.cookie_valid = valid_cookie