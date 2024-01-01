const port = 3000;
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const AppError = require("./utils/AppError")   // import custom Error class

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connection to mongo is now open.")
    })
    .catch((err) => {
        console.log("Mongo connection refused.")
        console.log(err);
    })

app.set("view engine", "ejs")                               // we don't have to type .ejs for ejs files anymore (hurray!)
app.set("views", path.join(__dirname, "/views"))            
app.engine("ejs", ejsMate)

app.use(express.urlencoded({extended:true}))                    //req.body parser
app.use(methodOverride("_method"))                              //used to send put and patch requests from html forms
app.use(express.static(path.join(__dirname, "public")))


const campRoutes = require("./routes/campgrounds")
app.use("/campgrounds", campRoutes)
const reviewRoutes = require("./routes/reviews")
app.use("/campgrounds/:id/reviews", reviewRoutes)

app.get("/", (req, res)=>{
    res.render("home")
});


app.all("*", (req, res, next) => {
    next(new AppError("Page Not Found :(", 404))
})

app.use((err, req, res, next) => {              // ERROR HANDLER
    const {status = 500} = err                
    if(!err.message) {
        err.message = "Oh no! Something went wrong :("
    }
    res.status(status).render("error", {err})
})

app.listen(port, ()=>{
    console.log(`Yelpcamp servers are now online on port ${port}.`)
})