const express = require("express");
const aap = express();
const mongoose = require("mongoose");
const path =require("path");
const listing = require('./models/listing.js');
const methodOverride = require("method-override");
//ejs mate is used to show same data on all pages
//no matter what displayed in body example a navbar
//which is displayed on top of all pages
const ejsmate = require("ejs-mate")
const wrapasync=require("./utils/wrapasync.js")
const ExpressError=require("./utils/expresserror.js")
const{listingschema}=require("./schema.js")

aap.set("view engine", "ejs");
aap.set("views", path.join(__dirname, "views"));
 aap.use(express.urlencoded({ extended: true }));
aap.use(methodOverride("_method"));
aap.engine('ejs',ejsmate);
//to serve static files
aap.use(express.static(path.join(__dirname,"/public")));
//aap.use is a middleware which gives acess to static files inside public
//folder to any request whether that is get or postor 

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/sidbnb");
}

aap.get("/",(req,res)=>{
    res.send("root");
});
// aap.get("/testlisting",async(req,res)=>{
//   let samplelisting = new listing({
//     title:"new property",
//     description:"by the beach",
//     price:2500,
//     location:"bhubaneswar,odisha",
//     country:"india"
//   }); 
//  await samplelisting.save();
//  console.log("sample data saved")
//  res.send("succeess");

// });


//schema validation
const validatelisting = (req,res,next)=>{
  let {error} = listingschema.validate(req.body);
if(res.error){
  throw new ExpressError(400,error);
}
else{
  next();
}
}

//index route
aap.get("/listing", wrapasync (async(req, res) => {
    const allListing = await listing.find({});
    res.render("listings/index.ejs", { allListing });
    //console.log(allListing);

  }));

 //New listing Route
     //if u keep new route after show route
     //it will treat it as id i.e(/listing/:id)
     //and search in db that ill give error
     //first it will check for new then id
aap.get("/listing/new", wrapasync(async(req, res) => {
    res.render("listings/new.ejs");
  }));

  //show route(read)
  aap.get("/listing/:id",wrapasync(async(req,res)=>{
    let{id} = req.params;
   const listingp = await listing.findById(id);
   res.render("listings/show.ejs",{listingp});
  }));


//Create Route
aap.post("/listing", wrapasync (async(req, res,next) => {
    //long method
    //let{title,description,image,price,country,location}=req.body;
    //short method mention ex:- name="listing[description]" in new.ejs
    //here listing acts as obj and description is key


//after requiring joi
//validate schema first call function validate listing
// let res = listingschema.validate(req.body);
// console.log(result);
const newListing = new listing(req.body.listing);

await newListing.save();
        res.redirect("/listing");
})


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

      
);

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

 
 
 
  //Edit Route
aap.get("/listing/:id/edit",validatelisting, wrapasync (async(req, res) => {
    let { id } = req.params;
    const listinged = await listing.findById(id);
    res.render("listings/edit.ejs", { listinged });
  }));

  //Update Route
aap.put("/listing/:id",validatelisting, wrapasync (async(req, res) => {
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
    await listing.findByIdAndUpdate(id, { ...req.body.listinggg });
    console.log("saved");
    res.redirect(`/listing/${id}`);
  })
);

  //Delete Route
aap.delete("/listing/:id", wrapasync (async(req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
  }));
  



  //  //after requiring expresserror
//match the url req with all the routes if not available then page not found
aap.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"))
  //constructor(statuscode,message)
})


//handling error
  aap.use((err,req,res,next)=>{
    let{statuscode,message}=err;
    // res.render("error.ejs",{message});
    res.render("error.ejs",{message});

    
    
    // res.status(statuscode).send(message);
  });

  aap.listen(8080,()=>{
    console.log("listenining on 8080");
});