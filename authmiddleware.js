const listing = require('./models/listing.js');//to be used in isowner function
const review = require('./models/review.js');//is review author


module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //req.isaut...()is a passport.js function
        req.session.redirectUrl = req.originalUrl;//see explanaton in movetoADDNEW.txt file
        req.flash("error","login to create post");
        return res.redirect("/login");
      }
      next();  //if user is authenticated then call next i.e proceed
      //if not then redirect to login page
};

////see following explanaton in movetoADDNEW.txt file
module.exports.saveredirecturl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;//from is loggedin
  }
  next();
};

    
//route protection: if listing owner's id != current user's id then throw error and return redirect to show route else update (also see show.ejs edit and delete button)
module.exports.isowner = async(req,res,next)=>{
    let { id } = req.params;//listing id

    let listingdetails = await listing.findById(id);
    if(!listingdetails.owner._id.equals(res.locals.curruser._id)){
      req.flash("error","unauthorized request");
     return  res.redirect(`/listing/${id}`);//if not writing return then it wont be updated in db but it wil show on screen localy
    }

    next();//to call next middleware that is isloggedin(see in show.ejs update,delete routes)
};

//route protection: if listing review owner's id != current user's id then throw error and return redirect to show route else update (also see show.ejs review edit and delete button)
module.exports.isreviewauthor = async(req,res,next)=>{
  let {id, reviewid } = req.params;//review id

  let reviewdetails = await review.findById(reviewid);
  if(!reviewdetails.author._id.equals(res.locals.curruser._id)){
    req.flash("error","unauthorized request");
   return  res.redirect(`/listing/${id}`);//if not writing return then it wont be updated in db but it wil show on screen localy
  }

  next();//to call next middleware that is isloggedin(see in show.ejs update,delete routes)
};