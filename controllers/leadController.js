import Lead from "../models/Lead.js";
import Property from "../models/Property.js";

// Create Lead (User enquiry)
export const createLead = async (req, res) => {
  try {
    const { propertyId, userName, userEmail, userPhone, message } = req.body;

    const property = await Property.findById(propertyId);
    // if (!property || property.status !== "approved") {
    //   return res.status(400).json({ message: "Invalid or unapproved property" });
    // }

    const lead = await Lead.create({
      property: propertyId,
      userName,
      userEmail,
      userPhone,
      message,
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Error creating lead", error });
  }
};

// Get all leads (Admin only)
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("property", "title location price listedBy")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads" });
  }
};

// Get Partner's leads (for properties listed by them)
export const getMyLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate({
        path: "property",
        match: { listedBy: req.user._id }, // only his properties
        select: "title location price",
      })
      .sort({ createdAt: -1 });

    // Filter null (other properties)
    res.json(leads.filter((l) => l.property !== null));
  } catch (error) {
    res.status(500).json({ message: "Error fetching your leads" });
  }
};

// Update lead status (Admin only)
export const updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = req.body.status; // new | contacted | closed
    await lead.save();

    res.json({ message: `Lead marked as ${lead.status}` });
  } catch (error) {
    res.status(500).json({ message: "Error updating lead status" });
  }
};
