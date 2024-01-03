const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{type: String, require:true, minLength:3,maxLength:30},
    email:{type:String, require:true, minLength:3,maxLength:100, unique:true},
    password:{type:String,require:true, minLength:3,maxLength:1024}
},{
    timestamps:true
})

const userModel = mongoose.model('User', userSchema);

module.exports=userModel;