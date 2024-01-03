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
            author: "65951c29dce4086d5b8cb9e4",
            location: `${cities[randomNumber].city}, ${cities[randomNumber].state}`,
            image: "https://source.unsplash.com/collection/18213269",
            price: Math.floor(Math.random() * 2000) + 1,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero porro, corrupti impedit at aperiam sapiente amet accusantium, molestias nobis corporis nesciunt quo itaque quaerat fugiat cupiditate animi enim dignissimos in."
        })
        await camp.save();  
    }
}
seeder()
    .then(()=>{
        mongoose.connection.close();
    })
