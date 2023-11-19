const joi = require('joi');

//now we will validate listing schema 
//an object will come inside joy obj called listing
module.exports.listingscshema = joi.object({
    listing:joi.object({
         title : joi.string.required(),
         description: joi.string.required(),
         location : joi.string.required(),
         country : joi.string.required(),
         price : joi.number.required().min(0),//minimum value is 0
         image:joi.string.allow("",null),//dont accept null
    }).required()//whenever we receive a joi object there should be a object called listing and it should be required

});