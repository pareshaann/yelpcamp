// we are going to use ONE TO MANY relationships ie we are only going to store ids of reviews on each campground
const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    rating: Number,
    body: String
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review;