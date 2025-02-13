// Here we use the concept of ExpressRouter, previously this code was written in th app.js file.

const express = require("express");
const router = express.Router();
const {isLoggedIn,validateListing}=require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })

const listingContoller = require("../controllers/listings.js");


//1 Index Route
router.get("/",wrapAsync(listingContoller.index));

//3 New Route
router.get("/new",isLoggedIn,listingContoller.renderNewForm);

//2 Show Route 
router.get("/:id", wrapAsync(listingContoller.showListing))

//4 Create Route
router.post("/",isLoggedIn,upload.single('image'),validateListing, wrapAsync(listingContoller.createListing));
// router.post("/",upload.single('image'),(req,res)=>{
//   res.send(req.file);
// })

//5 Edit Route 
router.get("/:id/edit",isLoggedIn,wrapAsync(listingContoller.renderEditForm));
//6 Update Route 
router.post("/:id",isLoggedIn,upload.single('image'),validateListing,wrapAsync(listingContoller.updateListing))

//7 Delete Route
router.post("/:id/DELETE",isLoggedIn,wrapAsync(listingContoller.deleteListng));
module.exports = router;