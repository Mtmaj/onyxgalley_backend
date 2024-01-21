const express = require("express")
const AdminModel = require("../../database/schema/AdminSchema").AdminModel
class Admin{
    constructor(username,password){
        this.username = username;
        this.password = password;
    }
    async valid_request() {
        const user = await AdminModel.findOne({username:this.username,password:this.password})
        if(user == null){
            return false
        }
        return true
    }
}

module.exports.Admin = Admin