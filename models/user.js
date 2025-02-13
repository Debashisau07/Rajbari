const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose  = require("passport-local-mongoose");

// for userSchema we need 3 field email, username and password.
const userSchema =  new Schema({
  email:{
    type:String,
    required: true,
  },
});
// by plugin passportLocalMongoose it automatically implement username , Hashing, Salting and and Hashed Password.(for more information read document of passportLocalMongoose) 
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);