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

const opts = {
  toJSON: {
    virtuals: true
  }
}

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
}, opts);

campgroundSchema.virtual("properties.popUpMarkup").get(function(){
  return `
    <strong> <a href="/campgrounds/${this._id}">${this.name}</a> </strong>
    <p> ${this.description.substring(0, 30)}... </p>
  `
})

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