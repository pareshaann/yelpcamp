const express = require("express")
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync")     // import async error handler
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")       // import validation middleware
const reviews = require("../controllers/reviews")


router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.delete("/:revId", isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));





module.exports = router;