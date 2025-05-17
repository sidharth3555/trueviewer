const mongoose =require("mongoose");
const Schema = mongoose.Schema;
const   Review=require("./review.js");
// title,image,price,location,country
const listingschema =  new Schema({

    title:{
        type:String,
        required:true,
    },

   description:String,
   priceunit:String,


    image:{
   url:String,
   filename:String,
    },
    price:String,
    location:String,
    country:String,
    reviews:[
        {//bracket important
          type:Schema.Types.ObjectId,
          ref:"Review"//reference is Review model
        }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"user",
    },
});

//if a listing is deleted then the reviews associated to that review wont be automatically deleted from review schema
//so to do that following code
listingschema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
  }
});

const listing = mongoose.model("listing",listingschema);
module.exports = listing;