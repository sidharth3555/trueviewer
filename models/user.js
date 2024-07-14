const { required } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userschema = new schema({
    email:{
        type:String,
        required:true,
    },
});
//bydefault passport will add a hashed username and password field
userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user",userschema);