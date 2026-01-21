const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => { //Campgrounds Route
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res) => { //Campground Creation Form
    res.render("campgrounds/new");
}

module.exports.create = async (req, res, next) => { //Campground Creation POST Request
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.url, filename: f.public_id }));
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Succesfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderUpdateForm = async (req, res) => { //Campground Update Form
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Campground Not Found!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}

module.exports.update = async (req, res) => { //Campground Update PUT Request
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    const imgs = req.files.map(f => ({ url: f.url, filename: f.public_id }))
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash("success", "Successfully Updated Campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req, res) => { //Campground DELETE Request
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Campground!");
    res.redirect("/campgrounds");
}

module.exports.renderDetails = async (req, res) => { //Campground Details Route
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!campground) {
        req.flash("error", "Campground Not Found!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}