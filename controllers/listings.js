const listing = require("../models/listing");

//taken from routes/listing.js 
//index route
module.exports.index=async(req, res) => {
    const allListing = await listing.find({});
    res.render("listings/index.ejs", { allListing });
    //console.log(allListing);

  };

  //new listing
module.exports.rendernewform=async(req, res) => {
  
    res.render("listings/new.ejs");
    };

    //show route
module.exports.showlisting=async(req,res)=>{
    
  let{id} = req.params;
 const listingp = await listing.findById(id)
 .populate({path:"reviews",
  populate:{//nested populate
    path:"author",//har ek listing ke saath uska reviews aa hi jaye aur, har ek review ke saath uska author bhi aaye(author inside review schema)
  }
 })
 .populate("owner");//also send owner info

 //if you are not using populate here then it will only show the object id
 //if populate is used then it will give the keys used in reviews model

 // for below 4line code Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
//  if(!listingp){
//   //if we are going to the same listingid after deletion then
//   req.flash("error","listing doesnot exists");
//       res.redirect("/listing");
//  }
console.log(listingp);
 res.render("listings/show.ejs",{listingp});
};


//create route
module.exports.createlisting=async(req, res,next) => {
  //long method
  //let{title,description,image,price,country,location}=req.body;
  //short method mention ex:- name="listinggg[description]" in new.ejs
  //here listing acts as obj and description is key



//after requiring joi
//validate schema first call function validate listing
// let res = listingschema.validate(req.body);
// console.log(result);

let url = req.file.path;
let filename=req.file.filename//path and file name is returned by req.file ,,try c.l(req.file) which is a multer method
    //path and filename is there inside image object inside listing schema

const newListing = new listing(req.body.listinggg);// A new instance of listinggg(defined in views/listings/new.ejs) got will be saved to db
//console.log(req.user);

newListing.owner = req.user._id;//its required to display in postedby field in show.ejs
//req.user is a object(from user schema) that contains 3 values such as id,email,username
//as user schema is pluged in with passport.js so it will return values through req.user
//console.log(req.user);

newListing.image={url, filename};//see explanation in update listing below
await newListing.save();
req.flash("success","New post published");
//define it in aap.js 
//after  aap.use (flash) 
//then go to views/listing/index.ejs then in top <%=success%> then views/includes/flash.ejs
res.redirect("/listing");

};

//if we are not using joi then use following
// if(!req.body.listinggg){
//   // only apply if we re sending data for modification to server like new entry
//   //if there is no object content inside listinggg body
// throw new ExpressError(400,"send valid data for listing")
// }
  // const newListing = new listing(req.body.listinggg);// new instance of listinggg got will be saved to db
      // await newListing.save();
      // res.redirect("/listing");


  //  if(!newListing.title){
  //   throw new ExpressError(400,"title is missing")
  //  }   
   

  //  if(!newListing.description){
  //   throw new ExpressError(400,"description is missing")
  //  } 
   

  //  if(!newListing.location){
  //   throw new ExpressError(400,"location is missing")
  //  } 

    


//without wrapasync
  //    try{ const newListing = new listing(req.body.listinggg);// new instance of listinggg got will be saved to db
//     await newListing.save();
//     res.redirect("/listing");
// }
// catch(err){
//   // aap.post .....next parameter added for middleware
// next(err);
// //above next calls the aap.use next middleware
// }



//edit route
module.exports.editlistings=async(req, res) => {

  let { id } = req.params;
  const listinged = await listing.findById(id);
  //not working
  // if(!listinged){
  //   //if we are going to the same listingid after deletion then
  //   req.flash("error","listing doesnot exists");
  //       res.redirect("/listing");
  //  }
  res.render("listings/edit.ejs", { listinged });
};


//update route
module.exports.updatelisting=async(req, res) => {
  //if(!req.body.listinggg){
    // only apply if we re sending data for modification to server like new entry
    //if there is no object content inside listinggg body
  // throw new ExpressError(400,"send valid data for listing")
  // }
  
  let { id } = req.params;
    console.log("id is",id);
    // here ...req.body.listingg is a js Object
    // which contains all parameters , ... it 
    // will deconstruct the values and return for updation
    //listinggg is the obj we created in edit.js 




    let listwithoutimg=await listing.findByIdAndUpdate(id, { ...req.body.listinggg });
    //listingwithout img will be containing nothing in place of url and path inside image object
    //basically it wont get it type="file" data so extract it from file.url and save
console.log(listwithoutimg);

if(typeof req.file !== "undefined"){//checking that user has send file , has not directly submitted
    let url = req.file.path;
    let filename=req.file.filename//path and file name is returned by req.file ,,try c.l(req.file) which is an multer method
    //path and filename is there inside image object inside listing schema
    listwithoutimg.image={url,filename};
    await listwithoutimg.save();
}
  
  
  req.flash("success"," post edited");

  res.redirect(`/listing/${id}`);
  };

//delete route
module.exports.deletelisting=async(req, res) => {
  let { id } = req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  console.log(deletedListing);
  
  req.flash("success"," Post earsed");

  res.redirect("/listing");
};