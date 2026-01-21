
//EXPRESS
const express = require("express");
const router = express.Router({ mergeParams: true });
//ERROR HANDLING
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage })
//MODELS
const Campground = require("../models/campground");

//MIDDLEWARE
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");


//CONTROLLERS
const campgrounds = require("../controllers/campgrounds");

router.route("/")
    .get(catchAsync(campgrounds.index)) //Campgrounds Route
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.create)) //Campground Creation Post Request


router.get("/new", isLoggedIn, campgrounds.renderNewForm) //Campgrounds Creation Form   

router.route("/:id")
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.update)) //Campgrounds Update PUT Request
    .get(catchAsync(campgrounds.renderDetails)) //Campgrounds Details Route
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete)) //Campgrounds DELETE Request



router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderUpdateForm)) //Campgrounds Update Form

module.exports = router;