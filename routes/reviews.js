const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema,reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const { isLoggedIn, isreviewauthor } = require("../middleware.js")
const { createReview, deleteReview } = require("../controllers/reviewcontroller");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((el) => el.message).join(",")
    );
  } else {
    next();
  }
};

// review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(createReview)
);

// delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isreviewauthor,
  wrapAsync(deleteReview)
);

module.exports = router;