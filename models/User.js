import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, default: null }, // important: google users have no password

    role: { type: String, enum: ["user", "partner", "admin"], default: "user" },

    googleId: { type: String, default: null }, // for google users only
    avatar: { type: String, default: null },
    authType: { type: String, enum: ["local", "google"], default: "local" },
  },
  { timestamps: true }
);

// Hash password only for local auth
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
