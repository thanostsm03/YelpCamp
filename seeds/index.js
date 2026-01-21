const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

//Connecting to Mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

//seedHelper Chooser
const sample = (array) => array[Math.floor(Math.random() * array.length)];

//Seeder
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "696a22c470a3f4fc4c48e452",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: "https://res.cloudinary.com/dgvqmfqhr/image/upload/v1768922372/campground1_mxbizw.jpg",
                    filename: "campground1_mxbizw"
                },
                {
                    url: "https://res.cloudinary.com/dgvqmfqhr/image/upload/v1768922429/campground3_oh6f73.jpg",
                    filename: "campground3_oh6f73"
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Officiis aut pariatur quia ipsum, assumenda veniam perferendis! Odio, consectetur explicabo ratione molestias itaque minus, illum qui, tempora at omnis modi architecto.",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})