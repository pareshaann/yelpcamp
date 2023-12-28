const mongoose = require("mongoose")

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,                                //hello test    
    location: String
});
 
const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;