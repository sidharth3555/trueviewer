//note:-here listingschema  is a individual method that validagtes the posted(post request) body and it doesnt have any link
//with models/this.listingschema.js ,,,same goes for review schema

const joi =require('joi');
//now we will validate listing schema 
//an object will come inside joy obj called listing
module.exports.listingschema = joi.object({
 //  listinggg:joi.object().required()
 //this means while there is a post request to create route check for listinggg object is present (see const newListing = new listing(req.body.listinggg) create route in aap.js;
 
 
 // A new instance of listinggg(defined in views/listings/new.ejs) got will be saved to db) and it should be required 
 //follow npm of joi document for more information
    listinggg:joi.object({
     //it is usually used to handel empty body requests(hopscotch request without body)
     //l.n 8
         title:joi.string().required(),
         description: joi.string().required(),
         location : joi.string().required(),
         country : joi.string().required(),
         price : joi.number().required().min(0),//minimum value is 0
         image:joi.string().allow("",null),//dont accept null
    }).required()//whenever we receive a joi object there should be a object called listing and it should be required

});
//review          
module.exports.reviewsschema=joi.object({
     review:joi.object({
          rating:joi.number().required().min(1).max(5),
          comment:joi.string().required(),
     }).required()
})

