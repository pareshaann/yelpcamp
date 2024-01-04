const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")     // import async error handler
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware")
const campgrounds = require("../controllers/campgrounds")

router.route("/")
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, wrapAsync(campgrounds.createNewCampground));


router.get("/new", isLoggedIn, campgrounds.renderNewForm)

router.route("/:id")
    .get(wrapAsync(campgrounds.renderCampground))
    .put(isLoggedIn, validateCampground, isAuthor, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));







module.exports = router;