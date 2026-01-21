const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.create = async (req, res) => { //Review POST Request
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review Posted!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req, res) => { //Review DELETE Request
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted Review!");
    res.redirect(`/campgrounds/${id}`);
}