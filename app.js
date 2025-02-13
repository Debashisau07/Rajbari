if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Listing = require("./models/listing.js");
const {isLoggedIn} = require("./middleware.js")
const{isReviewAuthor}=require("./middleware.js");
const Review= require("./models/review.js");
const User = require("./models/user.js");
const path = require("path");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const reviewController = require("./controllers/review.js");
const sessions = require("express-session");
const MongoStore = require("connect-mongo");


// for authentication and authorization
const passport =require("passport");
const LocalStrategy = require("passport-local");


const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

const wrapAsync = require("./utils/wrapAsync.js");

const dbUrl = process.env.ATLASDB_URL ;

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,
});
store.on("error",()=>{
  console.log("Mongo Session Store Error",err);
})
const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
} ;


app.use(sessions(sessionOptions));
app.use(flash());
// this part of authenication and authorization code will always written after using Sessions middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to parse JSON and URL-encoded form data
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For form data
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
.then(()=>{
  console.log("connected to DB")
})
.catch((err)=>{
  console.log(err);
});
async function main(){
  await mongoose.connect(dbUrl);
}

app.get("/", (req, res) => {
  res.redirect("/listings");
});


const validateReview=(req,res,next)=>{
  let {error}  = reviewSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error);
  }else{
    next();
  }
}
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})
app.use("/listings",listingRouter);
app.use("/",userRouter);


//2.0 Review route
app.post("/listings/:id/reviews",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//2.1 Delete Review route
app.post("/listings/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor,reviewController.deleteReview);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not found"));
})
app.use((err,req,res,next)=>{
  let{statusCode,message} = err;
  res.render("./listings/error.ejs",{message});
  // res.status(statusCode).send(message);
})
app.listen(3000,()=>{
  console.log("Server is listening to post 3000")
})


