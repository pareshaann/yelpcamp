const port = 3000;
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError")   // import custom Error class
const wrapAsync = require("./utils/wrapAsync")     // import async error handler

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connection to mongo is now open.")
    })
    .catch((err) => {
        console.log("Mongo connection refused.")
        console.log(err);
    })

const Campground = require("./models/campground")           //import campground mongoose model

app.set("view engine", "ejs")                               // we don't have to type .ejs for ejs files anymore (hurray!)
app.set("views", path.join(__dirname, "/views"))            
app.engine("ejs", ejsMate)

app.use(express.urlencoded({extended:true}))                    //req.body parser
app.use(methodOverride("_method"))                              //used to send put and patch requests from html forms

app.get("/", (req, res)=>{
    res.render("home")
});
app.get("/campgrounds", wrapAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}));
app.get("/campgrounds/new",(req, res) => {
    res.render("campgrounds/new")
})
app.post("/campgrounds", wrapAsync(async(req,res) => {
    if(!req.body.campground){               //Error thrown in absence of required model  properties like name, location etc 
        throw new ExpressError("Incomplete data to create Campground!", 400)
    }
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
}))
app.get("/campgrounds/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
    res.render("campgrounds/show", {camp})
}));
app.get("/campgrounds/:id/edit", wrapAsync(async(req,res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp })
}));
app.put("/campgrounds/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true});
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}));
app.delete("/campgrounds/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found :(", 404))
})

app.use((err, req, res, next) => {              // ERROR HANDLER
    const {status = 500} = err                
    if(!err.message) err.message = "Oh no! Something went wrong :("
    res.status(status).render("error", {err})
})

app.listen(port, ()=>{
    console.log(`Yelpcamp servers are now online on port ${port}.`)
})