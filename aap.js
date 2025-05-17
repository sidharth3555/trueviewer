if(process.env.NODE_ENV != "PRODUCTION"){
require('dotenv').config();
}
// console.log(process.env);

const express = require("express");
const aap = express();
const mongoose = require("mongoose");
const path =require("path");
const methodOverride = require("method-override");
//ejs mate is used to show same data on all pages
//no matter what displayed in body example a navbar
//which is displayed on top of all pages
const ejsmate = require("ejs-mate")
const ExpressError=require("./utils/expresserror.js")

const session = require("express-session");
const mongostore = require('connect-mongo');
const flash = require("connect-flash");


const passport = require("passport");//follow passport-local-mongoose documentation for more
const localstrategy = require("passport-local");//local stratgey is normal userid and password there
//is also other stratgies like login with google,github etc follow passport documentation for more
const user = require("./models/user.js");



const listingsrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");

const dburl=process.env.ATLAS_URL;//atlas link to connect mongo

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
    await mongoose.connect(dburl);
}


//mongo session store
const store=mongostore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,//interval(in minutes) between the session updates but have to pass it in seconds 24hrsX3600sec/hr
});

//if error occurs in mongo session store
store.on("error",()=>{
  console.log("error in mongo session store",err);

});

const sessionOptions ={
  //JavaScript objects are containers for named values called properties.
  //it can also contain functions as properties
   //we are creating a sessionOptions object here
   //we are defining named values like secret which is called property

   //to acess these objectName.propertyName
   //sessionOptions.secret

  store,//mongo session store
  secret:process.env.SECRET,
  resave:false,//reset
  saveUninitialized:true,//modified
  //here cookie is also an object with its own properties
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly: true,
  },
};


aap.use(session(sessionOptions));
aap.use(flash());//use flash before all routes
//bcz we gonna use this flash using routes


//now we will implement passport after the sessions bcz
//it can save the information used in a single session

aap.use(passport.initialize());
aap.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new localstrategy(user.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(user.serializeUser());////it can save the information used in a single session

passport.deserializeUser(user.deserializeUser());



aap.use((req,res,next)=>{
  // refer(routes/listing.js ) in create route
  res.locals.success = req.flash("success");//now this is rendered to all files inside views folder also to views/includes/flash.ejs
   //console.log(req.flash)
  // console.log(res.locals.success);//befor req.locals is an empty object with success array 
  //console.log(res.locals)
  res.locals.error = req.flash("error");//now this is rendered to all files inside views folder also to views/includes/flash.ejs
  res.locals.curruser = req.user;//used in navbar.ejs
  next();//as it has parameters ,so important to to call next() else we will be  stuck in this middleware
  
});


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






//   Syntax:
// app.use(path, callback)
aap.use("/listing", listingsrouter);//after importing all the routes from line no 15 we will join the routes with /listings AS,
//we had removed all the /listing from all the routes in routes/listing.js

aap.use("/listing/:id/reviews",reviewsrouter);
aap.use("/",userrouter);

//error handling

//after requiring expresserror
//match the url req with all the routes if not available then page not found
aap.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"))
  //constructor(statuscode,message)
})


//handling error
  aap.use((err,req,res,next)=>{
    let{statuscode,message}=err;
    // res.render("error.ejs",{message});
    //console.log(err);
    res.render("error.ejs",{message});

    
    
    // res.status(statuscode).send(message);
  });

  aap.listen(8080,()=>{
    console.log("listenining on 8080");
});