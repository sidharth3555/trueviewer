const mongoose =require("mongoose");
const Schema = mongoose.Schema;
 
// title,image,price,location,country
const listingschema =  new Schema({

    title:{
        type:String,
        required:true,
    },

   description:String,

    image:{
       type: String,
       //setting default value of img using ternary operator (ref:- mongooseejs,virtual)
         //compare if empty string
       set: (v)=> v === ""? 
       "https://tse3.mm.bing.net/th?id=OIP.6vfVDA-9P3m1y4DddcFWoAHaEK&pid=Api&P=0&h=180"
       :v,
    },
    price:Number,
    location:String,
    country:String,
});

const listing = mongoose.model("listing",listingschema);
module.exports = listing;