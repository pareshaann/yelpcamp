const Campground = require("../models/campground")           //import campground mongoose model

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new")
}

module.exports.createNewCampground = async(req,res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({
        url: f.path, 
        filename: f.filename
    }))
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Hurray! Successfully created a new campground.")
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.renderCampground = async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    console.log(camp)
    if(!camp) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {camp})
}

module.exports.renderEditForm = async(req,res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp })
}

module.exports.updateCampground = async(req, res) => {
    const {id} = req.params
    const updatedCamp = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true});
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted campground.")
    res.redirect("/campgrounds")
}