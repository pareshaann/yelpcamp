const Review = require("../models/review")              //import review mongoose model
const Campground = require("../models/campground")           //import campground mongoose model


module.exports.createReview = async(req, res) => {
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    camp.reviews.push(review)
    await review.save();
    await camp.save();
    req.flash("success", "Review added!")
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteReview = async(req, res) => {
    const {id, revId} = req.params
    /* We have to do two things here: 
        1. Delete the review (easy part)
        2. Remove the review id from the camp.reviews array
    */

    // Colts approach to the 2. (obviously faster and intellectual. Some might say "the ideal solution")
    // const camp = await Campground.findByIdAndUpdate(id, {$pull: {reviews: revId}})

    // My approach to this problem (slower and less intellectual. Not ideal but its mine and it does the same work)
    const camp = await Campground.findById(id);
    for(let i = 0; i < camp.reviews.length; i++){
        if(camp.reviews[i] == `new ObjectId('${revId}')`){
            camp.reviews.splice(i)
        }
    }
    await Review.findByIdAndDelete(req.params.revId)
    req.flash("success", "Review deleted successfully!")
    res.redirect(`/campgrounds/${id}`)
}