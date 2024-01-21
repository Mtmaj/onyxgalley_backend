const express = require("express")
const connectDB = require("./database/DataBaseConnect").connectDB
const router = require("./router/router")
const app = express()
var cors = require('cors');

connectDB()

app.use(cors())
app.use((req,res,next)=>{console.log("new request ",req.path);next()})
app.use('/',express.json({limit: '50mb'}))
app.use('/',express.urlencoded({limit: '50mb'}));
app.use('/api',router.router)

app.listen(5000,(err)=>{
    if(err == null){
        console.log("Server Run in Port 5000")
    }else {
        console.log("Run server Has Erorr "+err )
    }
})