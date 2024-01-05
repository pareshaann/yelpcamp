const Campground = require("../models/campground")           //import campground mongoose model
const {cloudinary} = require("../cloudinary")

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');                  // from the docs
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new")
}

module.exports.createNewCampground = async(req,res) => {
    
    
    const location = req.body.campground.location
    const result = await geocodingClient.forwardGeocode({
        query: location,                                        //from the docs
        limit: 1
    }).send();
    console.log(result.body.features[0].geometry.coordinates)
        
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
    const images = updatedCamp.images.concat(req.files.map(f => ({
        url: f.path, 
        filename: f.filename
    })))
    updatedCamp.images = images;
    await updatedCamp.save();
    if(req.body.deleteImages) {
        for(let i = 0; i < req.body.deleteImages.length; i++) {
            await cloudinary.uploader.destroy(req.body.deleteImages[i])
        }
        await updatedCamp.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
    }
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted campground.")
    res.redirect("/campgrounds")
}