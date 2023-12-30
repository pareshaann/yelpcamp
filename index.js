const port = 3000;
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connection to mongo is now open.")
    })
    .catch((err) => {
        console.log("Mongo connection refused.")
        console.log(err);
    })

const Campground = require("./models/campground")           //import campground model

app.set("view engine", "ejs")                               // we don't have to type .ejs for ejs files anymore (hurray!)
app.set("views", path.join(__dirname, "/views"))            
app.engine("ejs", ejsMate)

app.use(express.urlencoded({extended:true}))                    //req.body parser
app.use(methodOverride("_method"))                              //used to send put and patch requests from html forms

function wrapAsync(fn) {
    return function(req, res, next){
        fn(req, res, next).catch(e => next(e))                      // ERROR HANDLING FUNCTION (FOR ASYNC ERRORS)
    }
}

app.get("/", (req, res)=>{
    res.render("home")
});
app.get("/campgrounds", async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
});
app.get("/campgrounds/new",(req, res) => {
    res.render("campgrounds/new")
})
app.post("/campgrounds", wrapAsync(async(req,res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
}))
app.get("/campgrounds/:id", async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
    res.render("campgrounds/show", {camp})
});
app.get("/campgrounds/:id/edit", async(req,res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp })
})
app.put("/campgrounds/:id", async(req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true});
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}) 
app.delete("/campgrounds/:id", async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
})

app.use((err, req, res, next) => {
    res.send("something went fucking wrong")                // ERROR HANDLER
})

app.listen(port, ()=>{
    console.log(`Yelpcamp servers are now online on port ${port}.`)
})