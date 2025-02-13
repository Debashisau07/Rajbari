const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
  const{rating,comment}=req.body;
  const newReview = new Review({rating,comment});
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await(newReview.save());
  await(listing.save());
  // res.send("review saved successfuly")
  req.flash("success","Thanks for your review");
  res.redirect(`/listings/${listing._id}`);

};

module.exports.deleteReview = async(req,res)=>{
  const {id,reviewId} = req.params;
  await(Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}));// for delete the review id from the reviews array in listing
  await(Review.findByIdAndDelete(reviewId)); // for delete the review 
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
};