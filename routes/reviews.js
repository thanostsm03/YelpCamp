//EXPRESS
const express = require("express");
const router = express.Router({ mergeParams: true });
//ERROR HANDLING
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
//MODELS
const Campground = require("../models/campground");
const Review = require("../models/review");
//JOI SCHEMAS
const { reviewSchema } = require("../schemas.js");
const { validateReview, isLoggedIn } = require("../middleware")
//MIDDLEWARE
const { isReviewAuthor } = require("../middleware");
//CONTROLLERS
const reviews = require("../controllers/reviews");


router.post("/", isLoggedIn, validateReview, catchAsync(reviews.create)) //Review POST Request

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.delete)) //Review DELETE Request

module.exports = router;