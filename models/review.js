const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    
      comment: String,
      rating: {
        type: Number,
        min:1,
        max:5
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"user",
      },
    
});

module.exports=mongoose.model("Review",reviewSchema);
//now we have to add one more field in our
//listing schema called reviews(one-many relationship)line no 25