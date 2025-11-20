import Property from "../models/Property.js";

// Add Property (Partner only, with optional images)
// Add Property (Partner only, with optional images)

// Add Property (Partner only, with optional images)

export const addProperty = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map((f) => f.path) : [];

    const propertyData = {
      title: req.body.title,
      tagline: req.body.tagline,
      developer: req.body.developer,
      overview: req.body.overview,

      propertyType: req.body.propertyType || "sale",

      price: {
        value: req.body.priceValue,
        unit: req.body.priceUnit,
      },

      location: {
        city: req.body.city,
        area: req.body.area,
        landmark: req.body.landmark,
      },

      highlights: req.body["highlights[]"] || [],
      amenities: req.body["amenities[]"] || [],
      investmentBenefits: req.body["investmentBenefits[]"] || [],

      bookingDetails: {
        offers: req.body.bookingOffers,
        paymentPlans: req.body.bookingPlans,
        loanAssistance: req.body.bookingLoan,
      },

      contact: {
        primary: {
          name: req.body.contactPrimaryName,
          phone: req.body.contactPrimaryPhone,
          email: req.body.contactPrimaryEmail,
        },
        secondary: {
          name: req.body.contactSecondaryName,
          phone: req.body.contactSecondaryPhone,
          role: req.body.contactSecondaryRole,
        },
      },

      images: imageUrls,
      listedBy: req.user?._id,
    };

    const property = await Property.create(propertyData);

    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding property",
      error: error.message,
    });
  }
};






// // Get Approved Properties (Public)
// export const getApprovedProperties = async (req, res) => {
//   try {
//     const properties = await Property.find({ status: "Approved" || "approved" }).populate(
//       "listedBy",
//       "name email"
//     );
//     res.json(properties);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching properties" });
//   }
// };
// // Get Single Property by ID (Public)
// export const getPropertyById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const property = await Property.findById(id).populate(
//       "listedBy",
//       "name email"
//     );

//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     res.json(property);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching property", error });
//   }
// };

// // Get Partner's Properties
// export const getMyProperties = async (req, res) => {
//   try {
//     const properties = await Property.find({ listedBy: req.user.id });
//     res.json(properties);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching your properties" });
//   }
// };

// // Approve / Reject Property (Admin only)
// export const updatePropertyStatus = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);
//     if (!property) return res.status(404).json({ message: "Property not found" });

//     property.status = req.body.status; // approved | rejected
//     await property.save();

//     res.json({ message: `Property ${property.status}` });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating property status" });
//   }
// };

// // Search & Filter Properties (Public)
// export const searchProperties = async (req, res) => {
//   try {
//     const { location, minPrice, maxPrice, bhk, type } = req.query;

//     // Build query object dynamically
//     const query = { status: "approved" };

//     if (location) query.location = { $regex: location, $options: "i" };
//     if (type) query.type = type;
//     if (bhk) query.bhk = Number(bhk);
//     if (minPrice || maxPrice) query.price = {};
//     if (minPrice) query.price.$gte = Number(minPrice);
//     if (maxPrice) query.price.$lte = Number(maxPrice);

//     const properties = await Property.find(query).populate(
//       "listedBy",
//       "name email"
//     );

//     res.json(properties);
//   } catch (error) {
//     res.status(500).json({ message: "Error searching properties", error });
//   }
// };



// ✅ Get Approved Properties (Public)
// export const getApprovedProperties = async (req, res) => {
//   try {
//     const properties = await Property.find({
//       status: { $in: ["Approved", "approved","pending","Pending"] },
//     }).populate("listedBy", "name email");

//     res.status(200).json({
//       success: true,
//       count: properties.length,
//       properties,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching approved properties",
//       error: error.message,
//     });
//   }
// };

export const getApprovedProperties = async (req, res) => {
  try {
    // ✅ Fetch ALL properties — NO status filter
    const properties = await Property.find({})
      .populate("listedBy", "name email");

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching properties",
      error: error.message,
    });
  }
};


// ✅ Get Single Property by ID (Public)
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id).populate(
      "listedBy",
      "name email"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching property",
      error: error.message,
    });
  }
};

// ✅ Get Partner's Properties
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ listedBy: req.user.id });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching your properties",
      error: error.message,
    });
  }
};

// ✅ Approve / Reject Property (Admin)
export const updatePropertyStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    property.status = req.body.status;
    await property.save();

    res.json({
      success: true,
      message: `Property ${property.status}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating property status",
      error: error.message,
    });
  }
};

// ✅ Search & Filter Properties (Public)
export const searchProperties = async (req, res) => {
  try {
    const { location, bhk, type, minPrice, maxPrice } = req.query;

    const query = {
      // status: "approved", // 👉 REMOVE IF YOU WANT ALL PROPERTIES
    };

    // 👉 Location matches city OR area
    if (location) {
      query.$or = [
        { city: { $regex: location, $options: "i" } },
        { area: { $regex: location, $options: "i" } }
      ];
    }

    // 👉 BHK (2BHK, 3BHK etc.)
    if (bhk) {
      query.$and = [
        {
          $or: [
            { tagline: { $regex: bhk, $options: "i" } },
            { title: { $regex: bhk, $options: "i" } }
          ]
        }
      ];
    }

    // 👉 Type filter → rent/sale
    if (type) {
      query.propertyType = type;
    }

    // 👉 Price filtering
    if (minPrice || maxPrice) query["price.value"] = {};
    if (minPrice) query["price.value"].$gte = Number(minPrice);
    if (maxPrice) query["price.value"].$lte = Number(maxPrice);

    const properties = await Property.find(query).populate(
      "listedBy",
      "name email"
    );

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching properties",
      error: error.message,
    });
  }
};

// DELETE ALL PROPERTIES
export const deleteAllProperties = async (req, res) => {
  try {
    const result = await Property.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All properties deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting properties",
      error: error.message,
    });
  }
};
