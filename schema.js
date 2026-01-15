const joi = require("joi");
const review = require("./models/review");
const listing = require("./models/listing");

module.exports.listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country: joi.string().required(),
    image: joi.alternatives().try(
      joi.string().allow("", null),
      joi.object({
        url: joi.string().allow("", null),
        filename: joi.string().allow("", null)
      })
    ).allow(null),
  }).required()
});

module.exports.reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().required().min(1).max(5),
    comment: joi.string().required()
  }).required()
});