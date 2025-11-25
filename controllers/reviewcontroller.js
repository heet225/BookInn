const Review = require("../models/review");
const Listing = require("../models/listing");


module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let ListingData = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    ListingData.reviews.push(newReview);
    await newReview.save();
    await ListingData.save();
    console.log(ListingData);
    req.flash("success", "Successfully added a new review!");
    // res.send("Review Added Successfully");
    res.redirect(`/listings/${id}`);
  };

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
  };