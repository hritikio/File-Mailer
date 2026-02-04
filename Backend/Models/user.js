const mongoose = require("mongoose");

const { Schema,model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim:true
    },
    email: {
        type: String,
        require: true,
        unique:true
    },
    pass: {
        type: String,
        require: true,
        minLength:6
    },

},{timestamps:true});

const usermodel=model('User',userSchema);

module.exports=usermodel;
