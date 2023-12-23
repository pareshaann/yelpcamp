const cities = require("./cities")
const {places, descriptors} = require("./seedhelpers")
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connection to mongo is now open.")
    })
    .catch((err) => {
        console.log("Mongo connection refused.")
        console.log(err);
    })

const Campground = require("../models/campground")

const randomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const seeder = async()=>{
    await Campground.deleteMany();
    for(let i = 0; i < 50; i++){
        const randomNumber = Math.floor(Math.random() * 150)
        const camp = new Campground({
            name: `${randomElement(descriptors)} ${randomElement(places)}`,
            location: `${cities[randomNumber].city}, ${cities[randomNumber].state}`
        })
        await camp.save();  
    }
}
seeder()
    .then(()=>{
        mongoose.connection.close();
    })
