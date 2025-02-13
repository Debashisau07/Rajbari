const Joi = require('joi');
module.exports.listingSchema = Joi.object({
  
    title:Joi.string().required(),
    description:Joi.string().required(),
    image:Joi.string().allow("",null),
    price:Joi.number().required().min(0),
    country:Joi.string().required(),
    location:Joi.string().required(), category: Joi.string()
    .valid(
      "Desert", "Island", "Riverside", "Hilltop", "Forest", "Lakefront",
      "SnowyRegion", "FortArea", "Coastral", "CityPalace", "Countryside",
      "TempleComplex", "TeaGarden", "HeritageTown"
    )
    .required(), 
 
})
module.exports.reviewSchema = Joi.object({
  rating:Joi.number().required().min(1).max(10),
  comment:Joi.string().required(),
})