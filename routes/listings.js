const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const passport = require("passport");
const listingController = require("../controllers/listingcontroller.js");

const validateListing = (req, res, next) => {
  // accept either { listing: {...} } or flat { title, description, ... }
  const payload = req.body.listing ? req.body : { listing: req.body };
  const { error } = listingSchema.validate(payload);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// index route
router.get(
  "/",
  wrapAsync(listingController.index)
);

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

// show route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroylisting)
);

module.exports = router;
