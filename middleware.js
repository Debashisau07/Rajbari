const {listingSchema} = require("./schema");
const Review= require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js")

module.exports.isLoggedIn = (req,res,next)=>{
  // console.log(req.path,"...",req.originalUrl);
  console.log(req.user);
  if(!req.isAuthenticated()){
    // redirect url save 
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in to add your Rajbari!");
    return res.redirect("/login");
  }
  next();

}
module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}
// middleware for validate form from server side using Joi
module.exports.validateListing=(req,res,next)=>{
  let {error}  = listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error);
  }else{
    next();
  }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
  const {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you are not owner of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}