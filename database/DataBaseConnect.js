const mongoose = require("mongoose")


async function ConnectDB(){
    mongoose.connect('mongodb://root:kbUPLQS6RS0dJdFJmvUu4upR@onyxgallerybackend:27017/my-app?authSource=admin').then((err)=>{
        console.log("DataBase Connected !!!")
    }).catch((err)=>console.log("erorr"))
}

module.exports.connectDB = ConnectDB