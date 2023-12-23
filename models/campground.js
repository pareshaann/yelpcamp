const mongoose = require("mongoose")

const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    description: String,                                //hello test
    location: String
});
 
const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;