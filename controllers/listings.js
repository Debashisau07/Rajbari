const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let query = req.query.q;  // Search query
  let category = req.query.category;  // Category filter
  let allListings;
  let noResults = false; // Flag to track no search results

  let filter = {}; // Initialize an empty filter object

  // If a search query is present, filter by country (case-insensitive)
  if (query) {
    filter.country = { $regex: query, $options: "i" };
  }

  // If a category is present, filter by category
  if (category) {
    filter.category = category;
  }

  // Fetch listings based on filters
  allListings = await Listing.find(filter);

  // Check if no results found
  if (allListings.length === 0) {
    noResults = true;
    
    allListings = await Listing.find({}); // Fetch all listings if no matches
  }

  res.render("./listings/index.ejs", { allListings, query, category, noResults });
};



module.exports.renderNewForm = (req,res)=>{
  res.render("./listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
  let{id} = req.params;
  let listing = await Listing.findById(id).populate({path:"reviews",populate:{
    path:"author",
  },
  }).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs",{listing});
};

module.exports.createListing = async(req,res,next)=>{
  if (!req.user) {
   req.flash("error", "You must be logged in to add your Rajbari!");
   return res.redirect("/login");
 }
    let url = req.file.path;
    let filename = req.file.filename;
    let{title,description,price,country,location,category} = req.body;
     const newListing = new Listing({title,description,price,country,location,category});
     newListing.owner = req.user._id;
     newListing.image={url,filename};
    
    // console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");

};

module.exports.renderEditForm = async(req,res)=>{
  let{id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listings/edit.ejs",{listing});

};

module.exports.updateListing = async(req,res,next)=>{
  let{id} = req.params;
  let{title,description,price,country,location,category} = req.body;
  
  // Update the listing in the database
  let listing = await Listing.findByIdAndUpdate(
    id,
    {
      title,
      description,
      price,
      country,
      location,
      category
    },
    { new: true } // Return the updated document
  );
  if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  
  req.flash("success","Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListng = async(req,res)=>{
  let{id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted Successfully");
  res.redirect("/listings");
};
