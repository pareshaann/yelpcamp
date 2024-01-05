const mongoose = require("mongoose")
const Review = require("./review")
const User = require("./user")

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String
})

imageSchema.virtual("thumbnail").get(function(){
  return this.url.replace("/upload", "/upload/w_200")
})

const campgroundSchema = new mongoose.Schema({
    name: String,
    images: [imageSchema],
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
    geometry: { 
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      } 
    }
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