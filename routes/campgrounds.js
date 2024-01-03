const express = require("express")
const router = express.Router();

const AppError = require("../utils/AppError")   // import custom Error class
const wrapAsync = require("../utils/wrapAsync")     // import async error handler

const Campground = require("../models/campground")           //import campground mongoose model
const User = require("../models/user")

const {campgroundSchema} = require("../schemas")

const {isLoggedIn, isAuthor, validateCampground} = require("../middleware")


router.get("/", wrapAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}));
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})
router.post("/", isLoggedIn, validateCampground, wrapAsync(async(req,res) => {
    // if(!req.body.campground){               //Error thrown in absence of required model  properties like name, location etc 
    //     throw new AppError("Incomplete data to create Campground!", 400)
    // }
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Hurray! Successfully created a new campground.")
    res.redirect(`/campgrounds/${newCampground._id}`)
}))
router.get("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    if(!camp) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {camp})
}));
router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(async(req,res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp })
}));
router.put("/:id", isLoggedIn, validateCampground, isAuthor, wrapAsync(async(req, res) => {
    const updatedCamp = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true});
    req.flash("success", "Successfully updated campground!")
     res.redirect(`/campgrounds/${updatedCamp._id}`);
}));
router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted campground.")
    res.redirect("/campgrounds")
}))

module.exports = router;