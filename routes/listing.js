const express = require("express");
const router = express.Router();
const wrapasync=require("../utils/wrapasync.js")
const{listingschema}=require("../schema.js")//{ }is here so only listingschema from schema.js will be imported
const ExpressError=require("../utils/expresserror.js")
const listing = require('../models/listing.js');
const{isloggedin, isowner} = require("../authmiddleware.js");
const listingcontroller = require("../controllers/listings.js")

//multer is a npm package which is used to save a multipart data i.e a image
const multer = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({storage});//mentioning folder destination name where the photos will be stored

//listing schema validation
const validatelisting = (req, res, next)=>{
    let {error} = listingschema.validate(req.body); //refer to schema.js folder .validate
    //here validate is a joi method where body is passed
    if(res.error){
      throw new ExpressError(400,error);
        // ExpressError is the constructor ,,see in utils/expresserror
    
    }
    else{
      next();
    }
    };


//before router.route(as path is same i.e "/")
//index route
// //inside code moved to controllers/listing.js
// router.get("/", wrapasync (listingcontroller.index));
// //Create Route
// router.post("/",isloggedin,validatelisting, wrapasync (listingcontroller.createlisting));
 
//after router.route 
//inside code moved to controllers/listing.js
router.route("/")//as path is same i.e "/"  so router.route 
.get(wrapasync (listingcontroller.index))//index route
.post(isloggedin,validatelisting, upload.single('listinggg[image]'),wrapasync (listingcontroller.createlisting));//create route
 // upload.single('listinggg[image]' for multer
//listinggg[image]') is the name of the image field see in new.ejs
 // .post(upload.single('listinggg[image]'),(req,res)=>{//upload.single('listinggg[image]') is the name of the image field see in new.ejs
//   res.send(req.file);
// });
 
//New listing Route
     //if u keep new route after show route
     //it will treat it as id i.e(/listing/:id)
     //and search in db that ill give error
     //first it will check for new then id

router.get("/new",isloggedin, wrapasync(listingcontroller.rendernewform));

  
//show route(read)
  router.get("/:id",wrapasync(listingcontroller.showlisting));



 
 
//Edit Route
router.get("/:id/edit",isloggedin,isowner, wrapasync (listingcontroller.editlistings));

 
//Update Route
router.put("/:id",isloggedin,isowner,upload.single('listinggg[image]'), validatelisting, wrapasync (listingcontroller.updatelisting));

  
//Delete Route
router.delete("/:id",isloggedin,isowner, wrapasync (listingcontroller.deletelisting));
  
  module.exports = router;