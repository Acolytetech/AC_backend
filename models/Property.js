import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["rent", "lease", "buy"], required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    bhk: { type: Number }, // bedrooms
    amenities: [{ type: String }],
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
