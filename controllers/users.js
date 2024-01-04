const User = require("../models/user")


module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register")
}

module.exports.registerNewUser = async(req, res, next) => {
    try{
        const {username, email, password} = req.body
        const user = new User({
            username,
            email
        })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash("success", "Welcome to YelpCamp!")
            res.redirect("/campgrounds")
        })
        
    } catch(e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login")
}

module.exports.loginUser = (req, res) => {   
    req.flash("success", `Welcome back, ${req.user.username}!`)
    const redirectUrl = res.locals.returnTo || "/campgrounds"
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        req.flash("success", "Adios amigo!")
        res.redirect("/campgrounds")
    });
    
}