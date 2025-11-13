// import mongoose from "mongoose";

// const propertySchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String },
//     type: { type: String, enum: ["rent", "lease", "buy"], required: true },
//     price: { type: Number, required: true },
//     location: { type: String, required: true },
//     bhk: { type: Number }, // bedrooms
//     amenities: [{ type: String }],
//     images: [{ type: String }],
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//     listedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Property", propertySchema);


import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String },
    developer: { type: String },
    type: {
      type: String,
      enum: ["rent", "lease", "sale"],
      default: "sale",
      required: true
    },

    // Price details
    price: {
      value: { type: String, required: true },
      unit: { type: String, default: "per sq. yd." },
    },

    // Location details
    location: {
      city: { type: String },
      area: { type: String },
      landmark: { type: String },
    },

    overview: { type: String },
    status: { type: String }, // Example: JDA Approved

    // Arrays
    highlights: [{ type: String }],
    amenities: [{ type: String }],
    investmentBenefits: [{ type: String }],

    // Booking and payment info
    bookingDetails: {
      offers: { type: String },
      paymentPlans: { type: String },
      loanAssistance: { type: String },
    },

    // Contact information
    contact: {
      primary: {
        name: { type: String },
        phone: { type: String },
        email: { type: String },
      },
      secondary: {
        name: { type: String },
        phone: { type: String },
        role: { type: String },
      },
    },

    // Optional property data
    bhk: { type: Number },
    images: [{ type: String }],

    // Admin workflow
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
