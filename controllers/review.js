const Review=require("../models/review.js");
const listing = require("../models/listing");
const review = require("../models/review.js");



//create review
module.exports.createreview=async(req,res)=>{
    let listingobj=await listing.findById(req.params.id);
       //to find a particular listing object from listing schema id is required
      //logically evary listing has its own reviews
     //listingid is required as every listing has its own review array see /models/listing.js line no 25
    
    let newReview=new Review(req.body.review);
    //HERE review(small r) in "req.body.review" is the review object "comes from  review[rating]" (see at last of show.ejs ),, 
    //and  Review(capital R) is our review model in models folder ,,which will create a document(as obj)
//...req.body.review uses the spread syntax,
// which is used to spread the elements of an iterable (like an array or a string) or properties of an object. It effectively creates a shallow copy of the elements or properties.
    
newReview.author = req.user._id;//author field in schema.js p2pd
    console.log(newReview);
    //////now we have listingid and review object(which has the content)/////////////then
    
    listingobj.reviews.push(newReview);//saved as objid ,,as type is objid see /models/listing.js line no 27
      //every listing will have its own
      //reviews array as we have defined in /models/listing.js line no 25
    
    await newReview.save();////newReview saved to review model
    await listingobj.save();
    
    //after newreview.save() it is changed in Review model but,
    //to  change  in our listing model(main homepage model) we have to call listing.save()//see models/listing.js line no 28
    console.log("new review saved");
    res.send("Thankyou for your reviews");
    req.flash("success","new review created");

};

//delete review
module.exports.deletereview=async(req,res)=>{
    //we firestly need both main listing id with review id
    //we have to delete the document in review schema as well as
    //the object id present in review array in listing schema
    let{ id,reviewid }=req.params;
  
    //await listing.findByIdAndDelete(id);//directly doing this will set null in all values
    //which will give error in show.ejs while reading values for display
     //so
  
    await listing.findByIdAndUpdate(id,{$pull:{reviews: reviewid}});
    //here pull is mongoose operation here pull means
    //if any of the objectId in review arary in listing schema matches with reviewid
    //we will pull that out from listing schema
    //deleted from listing schema
  
  
    await Review.findByIdAndDelete(reviewid);
    //deleted from review schema
    
    //here if a listing is deleted but the reviews
    //associated with that wont be deleted
    //so to also delete that we will use
    //mongoose post middleware for more see models/listing.js
  
    req.flash("success"," review deleted");


    res.redirect(`/listing/${id}`);
  };