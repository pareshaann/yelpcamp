const mongoose = require("mongoose")
const Review = require("./review")
const User = require("./user")

const campgroundSchema = new mongoose.Schema({
    name: String,
    images: [
      {
        url: String,
        filename: String
      }
    ],
    price: Number,
    description: String,                                //hello test    
    location: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
      }  
    ],
});

campgroundSchema.post("findOneAndDelete", async function(deletedCamp) {
  if(deletedCamp){
    await Review.deleteMany({
      _id:{
        $in: deletedCamp.reviews
      }
    })
  }
})


const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;