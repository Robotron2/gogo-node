const { isValidObjectId } = require("mongoose") 
const models = require("../models") 
const Pricing = models.Pricing 

const getAllPricing = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        const filter = {};

        
        if (req.query.minInterstatePrice || req.query.maxInterstatePrice) {
            filter.interstatePrice = {};
            if (req.query.minInterstatePrice) {
                filter.interstatePrice.$gte = parseFloat(req.query.minInterstatePrice);
            }
            if (req.query.maxInterstatePrice) {
                filter.interstatePrice.$lte = parseFloat(req.query.maxInterstatePrice);
            }
        }

        if (req.query.minIntrastatePrice || req.query.maxIntrastatePrice) {
            filter.intrastatePrice = {};
            if (req.query.minIntrastatePrice) {
                filter.intrastatePrice.$gte = parseFloat(req.query.minIntrastatePrice);
            }
            if (req.query.maxIntrastatePrice) {
                filter.intrastatePrice.$lte = parseFloat(req.query.maxIntrastatePrice);
            }
        }

        const sortField = req.query.sortField || "createdAt";
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sort = {};
        sort[sortField] = sortOrder;

        
        let allPricing = await Pricing.find(filter)
            .populate({
                path: "pickupLocation",
                select: "name zone state",
            })
            .populate({
                path: "dropoffLocation",
                select: "name zone state",
            })
            .select("interstatePrice intrastatePrice pickupLocation dropoffLocation createdAt")
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        
        if (req.query.state) {
            const state = req.query.state.toLowerCase();
            const stateRegex = new RegExp(state, 'i'); 
            allPricing = allPricing.filter(pricing => {
                const pickupState = pricing.pickupLocation?.state?.toLowerCase();
                const dropoffState = pricing.dropoffLocation?.state?.toLowerCase();
                return stateRegex.test(pickupState) || stateRegex.test(dropoffState);
            });
        }

        const totalCount = await Pricing.countDocuments(filter);

        res.status(200).json({ allPricing, totalCount });
    } catch (error) {
        console.error("Error in get Rides controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const updateLocationPricingController = async (req, res) => {
  try {
    const { pricingId } = req.params 
    const { interstatePrice, intrastatePrice } = req.body 

    if (!pricingId || !isValidObjectId(pricingId)) {
      return res.status(400).json({ error: "Invalid pricing ID" }) 
    }

    const pricing = await Pricing.findById(pricingId) 

    if (!pricing) {
      return res.status(404).json({ error: "Pricing not found" }) 
    }

    if (interstatePrice !== undefined && !isNaN(interstatePrice)) {
      pricing.interstatePrice = interstatePrice 
    }
    if (intrastatePrice !== undefined && !isNaN(intrastatePrice)) {
      pricing.intrastatePrice = intrastatePrice 
    }

    await pricing.save() 

    return res.status(200).json({ pricing }) 
  } catch (error) {
    console.error("Error in updateLocationPricing controller:", error) 
    return res.status(500).json({ error: "Internal server error" }) 
  }
} 

module.exports = { getAllPricing, updateLocationPricingController } 
