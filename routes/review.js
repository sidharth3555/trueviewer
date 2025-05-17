const express = require("express");
const router = express.Router({mergeParams: true});
const wrapasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/expresserror.js");

const{reviewsschema}=require("../schema.js")// ../for parent directory     //{ }is here so only reviewsschema from schema.js will be imported
//see explanation in theory.txt l.n 29
const Review=require("../models/review.js");
const listing = require('../models/listing.js');
const {isloggedin, isreviewauthor} = require("../authmiddleware.js");
const reviewcontroller = require("../controllers/review.js");

//review schema validation
const validatereview = (req, res, next)=>{
    let {error} = reviewsschema.validate(req.body);//refer to schema.js folder for .validate
    //here validate is a joi method where body is passed
    if(res.error){
      throw new ExpressError(400,error);
      //new will create an instance of expresserror class ,,see in utils/expresserror
    }
    else{
      next();
    }
    };


//create rewiews route(important conceptual)

// when ever any request comes to the routes under the review.js folder it will
// first validate the review by validatereview function 
// inside the function it will look for req.body to validate (written in schema.js folder)
//req.body comes from views/listings/show.ejs from 51 to 67


router.post("/",validatereview,isloggedin,wrapasync(reviewcontroller.createreview));
    
    
    
   
//delete reviews route
    router.delete("/:reviewid",isloggedin,isreviewauthor, wrapasync(reviewcontroller.deletereview)
    );
    

    module.exports=router;
    