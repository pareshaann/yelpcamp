const Campground = require("./models/campground")
const {campgroundSchema, reviewSchema} = require("./schemas")
const AppError = require("./utils/AppError")

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be logged in!")
        return res.redirect("/login")
    } 
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnTo) { 
        res.locals.returnTo = req.session.returnTo
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
    if(!camp.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${camp._id}`)
    } 
    next();
}

module.exports.validateCampground = (req, res, next) => {                    //campground validator middleware using JOI
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(", ")   
        //error.details is an array on which .map() function is used. This returns an array of only the error messages. On this array, the .join(", ") function is used, which creates and returns a string of all errors seperated by a comma.
        throw new AppError(msg, 400)                          
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {                    // review validator middleware using JOI
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(", ")
        throw new AppError(msg, 400)
    } else {
        next();
    }
}