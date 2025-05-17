const user = require("../models/user");


//render signup
module.exports.rendersignup=(req,res)=>{
    res.render("users/signup.ejs");
};

//signup  route
module.exports.signup=async(req,res)=>{
    //although we are using wrapasync for error handeling but,
    //if the user already exists(by giving same id pass that already exists) error comes then we 
    //should redirect to same sign up page with error message,,,, to do that we have to implement the functionality 
    //in catch block(see l.no 27),,without the catch block it wont be reditected
   try{
    let { username,email,password } = req.body;
    const newuser = new user({email,username});//password automatically saved by passport-local
    const registereduser = await user.register(newuser,password);//its a passport.js nmp package method
    console.log(registereduser);
    
    //req.login is a passport.js method which automatically logsin user after sign up
    //after signing up user dont have to visit login route again 
    //for more follow passport.js documentation (req.login)
    req.login(registereduser ,(err)=>{
        if(err){
            return next(err);
        }
        //else
        req.flash("success","welcome home");
        res.redirect("/listing");
    });
    
}
catch(e){
    req.flash("error",e.message);
    //The .message property is a standard property of the Error object in JavaScript
    // that contains a descriptive message about the error.
    res.redirect("/signup")
}
};


//login 
module.exports.renderlogin=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=async(req,res)=>{
    //here passport.authenticate is a authenticate() function  provided by passport.js ,which is used as route middleware
    //to authenticate requests (username and password), if failure occurs it will redirect to /login and display a flash message
    //if no failure then execute async(req,res)=>{...}

   // res.send("logedin successfully!!");
req.flash("success","Loggedin successfully!! ")

//from authmiddleware
let redirectUrl = res.locals.redirectUrl || "/listing"
//some times redirect may send empty objects so we will add or see movetoADDNEW.txt file for more
//if obj is empty then redirect to /listing bcz of false||true 
res.redirect(redirectUrl);
};


//logout
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{//req.logout is a passport method
        if(err){
            next(err);
        }
        req.flash("success","loggedout successfully");
        res.redirect("/listing");
    })
};
