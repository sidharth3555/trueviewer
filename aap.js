const express = require("express");
const aap = express();
const mongoose = require("mongoose");
const path =require("path");
const listing = require('./models/listing.js');
const methodOverride = require("method-override");

aap.set("view engine", "ejs");
aap.set("views", path.join(__dirname, "views"));
 aap.use(express.urlencoded({ extended: true }));
aap.use(methodOverride("_method"));

//sid
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

//index route
aap.get("/listing", async (req, res) => {
    const allListing = await listing.find({});
    res.render("listings/index.ejs", { allListing });
    //console.log(allListing);
  });

 //New listing Route
     //if u keep new route after show route
     //it will treat it as id i.e(/listing/:id)
     //and search in db that ill give error
     //first it will check for new then id
aap.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs");
  });

  //show route(read)
  aap.get("/listing/:id",async(req,res)=>{
    let{id} = req.params;
   const listingp = await listing.findById(id);
   res.render("listings/show.ejs",{listingp});
  });


//Create Route
aap.post("/listing", async (req, res) => {
    //long method
    //let{title,description,image,price,country,location}=req.body;
    //short method mention ex:- name="listing[description]" in new.ejs
    //here listing acts as obj and description is key
    const newListing = new listing(req.body.listinggg);// new instance of listinggg got will be saved to db
    await newListing.save();
    res.redirect("/listing");
  });
  //Edit Route
aap.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listinged = await listing.findById(id);
    res.render("listings/edit.ejs", { listinged });
  });

  //Update Route
aap.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    console.log("id is",id);
    // here ...req.body.listingg is a js Object
    // which contains all parameters , ... it 
    // will deconstruct the values and return for updation
    //listinggg is the obj we created in edit.js 
    await listing.findByIdAndUpdate(id, { ...req.body.listinggg });
    console.log("saved");
    res.redirect(`/listing/${id}`);
  });

  //Delete Route
aap.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
  });
  

  aap.listen(8080,()=>{
    console.log("listenining on 8080");
});
