const express = require("express");
const user = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveredirecturl } = require("../authmiddleware");
const router = express.Router();
const usercontroller = require("../controllers/user");

//signup route
//get route for , signup form render and post route for saving and validation from form data
router.get("/signup",usercontroller.rendersignup);

router.post("/signup",wrapasync(usercontroller.signup));

//login route
router.get("/login",usercontroller.renderlogin);

 router.post("/login",saveredirecturl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true }),usercontroller.login);

//logout
router.get("/logout",usercontroller.logout);

module.exports=router;