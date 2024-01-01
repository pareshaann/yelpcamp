const express = require("express")
const router = express.Router();

const AppError = require("../utils/AppError")   // import custom Error class
const wrapAsync = require("../utils/wrapAsync")     // import async error handler

const Campground = require("../models/campground")           //import campground mongoose model

const {campgroundSchema} = require("../schemas")

const validateCampground = (req, res, next) => {                    //campground validator middleware using JOI
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(", ")   
        //error.details is an array on which .map() function is used. This returns an array of only the error messages. On this array, the .join(", ") function is used, which creates and returns a string of all errors seperated by a comma.
        throw new AppError(msg, 400)                          
    } else {
        next();
    }    
}

router.get("/", wrapAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}));
router.get("/new", (req, res) => {
    res.render("campgrounds/new")
})
router.post("/", validateCampground, wrapAsync(async(req,res) => {
    // if(!req.body.campground){               //Error thrown in absence of required model  properties like name, location etc 
    //     throw new AppError("Incomplete data to create Campground!", 400)
    // }
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", "Hurray! Successfully created a new campground.")
    res.redirect(`/campgrounds/${newCampground._id}`)
}))
router.get("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate("reviews")
    res.render("campgrounds/show", {camp})
}));
router.get("/:id/edit", wrapAsync(async(req,res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp })
}));
router.put("/:id", validateCampground, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true});
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}));
router.delete("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted campground.")
    res.redirect("/campgrounds")
}))

module.exports = router;