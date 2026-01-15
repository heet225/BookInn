const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be login in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveredirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    // delete req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
    if (!res.locals.currentUser || !listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isreviewauthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }
    if (!res.locals.currentUser || !review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
