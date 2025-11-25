const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  };

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    // normalize payload: accept either { listing: {...} } or flat { title, ... }
    const data = req.body.listing ? req.body.listing : req.body;
    let newListing = new Listing(data);
    newListing.owner = req.user._id;
    console.log(newListing);
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  };

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let ListingData = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!ListingData) {
      req.flash("error", "listing doesn't exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { ListingData });
  };

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let ListingData = await Listing.findById(id);
    if (!ListingData) {
      req.flash("error", "listing doesn't exist!");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { ListingData });
  };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // when form is nested use req.body.listing, otherwise req.body
    const updateData = req.body.listing ? req.body.listing : req.body;
    await Listing.findByIdAndUpdate(id, updateData, { runValidators: true });
    req.flash("success", "Successfully updated the listing!");
    res.redirect("/listings");
  };

module.exports.destroylisting =async (req, res) => {
    let { id } = req.params;
    let ListingData = await Listing.findByIdAndDelete(id);
    console.log(ListingData);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
  }