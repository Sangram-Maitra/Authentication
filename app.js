//jshint esversion:6
require('dotenv').config()
const express= require("express");
const ejs= require("ejs");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

//added mongoose encryption here
const userSchema = new mongoose.Schema({
    email:String,
    pass:String
})

secret=process.env.secret_Key;
// userSchema.plugin(encrypt, { secret: secret , encryptedFields: ["pass"] });
userSchema.plugin(encrypt, { secret: process.env.secret_Key , encryptedFields: ["pass"] });


//connecting collection
const user = new mongoose.model("User",userSchema)


app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/register",function(req,res){
    const newUser=new user({
        email:req.body.username,
        pass:req.body.password
    })

    newUser.save(function(err){
        if(err)
        {
            console.log(err)
        }
        else{
            res.render("secrets");
        }
    })
})

app.post("/login",function(req,res){
    const pageName=req.body.username;
    const pagePass=req.body.password;

    user.findOne({email:pageName},function(err,result){
        if(err){
            console.log(err)
        }
        else{
            if(result){
                if(result.pass==pagePass)
                {
                    res.render("secrets")
                }
                else{
                    console.log("pass error")
                }
            }
        }
    })
})

app.listen("5000",function(){
    console.log("server started at port 5000");
})