require('dotenv').config()

const express = require("express");

const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
// In order to serve up static pages on website copy all the css and javascript folders in the public folder
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
console.log(process.env.SECRET);

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
// Since we gonna be using mongoose encryption methood to encrypt our passwords hence we are making a modified version of the schema
const userSchema=new mongoose.Schema ({
    email:String,
    password:String
});

// the methood is a convenient method and is given in the documentation.Please have a look through it to make it feasible and easy to understand
// before creating the model add the plugin
// encrypted model code is given in the docs only be sure to have a read
// Only the password field is encrypted not the email
// process.env.<name_of_the_key> you want to hide.This is the way you can add variables from the .env folder
userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ["password"] });

const User=new mongoose.model("User",userSchema);

app.get('/',function(req,res){
  res.render("home");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.get("/register",function(req,res){
  res.render("register");
})
app.post("/register",function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});
app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if (err){
      console.log(err);
    }
    else{
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});
app.listen(3000,function(){
  console.log("Server up and running");
})
