import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { OAuth2Client } from "google-auth-library";
const generateToken = (id) => {
  return jwt.sign({ id  }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ---------------- REGISTER USER ----------------
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    const token = generateToken(user._id, user.role);

    res.setHeader(
  "Set-Cookie",
  serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  })
);


    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// };

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No Google credential provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        avatar: picture,
        authType: "google",
        password: null,
      });
    }

    const token = generateToken(user._id);
    const isProd = process.env.NODE_ENV === "production";

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: isProd ? true : false,
        sameSite: isProd ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })
    );

    res.json({
      message: "Google Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Google Login Error", error);
    res.status(500).json({ message: "Google Login Failed" });
  }
};

// ---------------- GET LOGGED-IN USER ----------------
export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    token: req.token,
    role: req.user.role,
  });
};

// ---------------- LOGIN USER ----------------

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id, user.role);
const isProd = process.env.NODE_ENV === "production";

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: isProd ? true : false,   // LOCALHOST par secure = false
    sameSite: isProd ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })
    );

    res.json({
      message: "Login successful",
token:token,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// ---------------- LOGOUT USER ----------------
export const logoutUser = async (req, res) => {
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", { httpOnly: true, path: "/", maxAge: -1 })
  );
  res.json({ message: "Logged out successfully" });
};

// ---------------- GET ALL USERS ----------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ---------------- GET SINGLE USER ----------------
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// ---------------- UPDATE USER ----------------
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Validate fields (optional)
    if (!name || email || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role,
      },
      { new: true, runValidators: true } // validate email format etc.
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};


// ---------------- DELETE USER ----------------
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
