const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const {storeReturnTo} = require("../middleware")
const users = require("../controllers/users")


router.route("/register")
    .get(users.renderRegisterForm)
    .post(wrapAsync(users.registerNewUser))

router.route("/login")
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), users.loginUser)

router.get("/logout", users.logoutUser)





module.exports = router;