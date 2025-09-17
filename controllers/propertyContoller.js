import Property from "../models/Property.js";

// Add Property (Partner only, with optional images)
export const addProperty = async (req, res) => {
  try {
    // Agar images upload hui hain to Cloudinary se URLs le lo
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const property = await Property.create({
      ...req.body,
      listedBy: req.user._id,
      images: imageUrls,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: "Error adding property", error });
  }
};

// Get Approved Properties (Public)
export const getApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "Approved" || "approved" }).populate(
      "listedBy",
      "name email"
    );
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties" });
  }
};
// Get Single Property by ID (Public)
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id).populate(
      "listedBy",
      "name email"
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Error fetching property", error });
  }
};

// Get Partner's Properties
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ listedBy: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your properties" });
  }
};

// Approve / Reject Property (Admin only)
export const updatePropertyStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.status = req.body.status; // approved | rejected
    await property.save();

    res.json({ message: `Property ${property.status}` });
  } catch (error) {
    res.status(500).json({ message: "Error updating property status" });
  }
};

// Search & Filter Properties (Public)
export const searchProperties = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, bhk, type } = req.query;

    // Build query object dynamically
    const query = { status: "approved" };

    if (location) query.location = { $regex: location, $options: "i" };
    if (type) query.type = type;
    if (bhk) query.bhk = Number(bhk);
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);

    const properties = await Property.find(query).populate(
      "listedBy",
      "name email"
    );

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error searching properties", error });
  }
};
