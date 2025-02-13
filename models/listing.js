const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: [
      "Desert", "Island", "Riverside", "Hilltop", "Forest", "Lakefront",
      "SnowyRegion", "FortArea", "Coastral", "CityPalace", "Countryside",
      "TempleComplex", "TeaGarden", "HeritageTown"
    ], 
    required: true,
    default: "Hilltop" // Ensures every listing has a category
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Automatically delete reviews when a listing is removed
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
