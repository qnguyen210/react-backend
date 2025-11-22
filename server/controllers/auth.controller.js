import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "./../../config/config.js";

// SIGNUP: create a new user with username + name + email + password.
// Returns 201 with token + user or appropriate error status.
const signup = async (req, res) => {
   console.log("Signup body:", req.body); 
  try {
    const { username, name, email, password } = req.body;

    // basic validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email and password are required" });
    }

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // check duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // check duplicate username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // create user including username + name + email
    const user = new User({ username, name, email });

    // trigger virtual password setter on the User schema
    user.password = password;

    await user.save();

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      config.jwtSecret
    );

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signup error", err);
    return res.status(500).json({ error: "Could not sign up" });
  }
};

// SIGNIN: check email + password, return token + user info.
const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "User not found" });

    if (!user.authenticate(req.body.password)) {
      return res
        .status(401)
        .send({ error: "Email and password don't match." });
    }

    const effectiveRole = user.role || "user";

    const token = jwt.sign(
      { _id: user._id, role: effectiveRole },
      config.jwtSecret
    );

    res.cookie("t", token, { expire: new Date() + 9999 });

    return res.json({
      token,
      user: {
        _id: user._id,
        username: user.username, // may be undefined for very old users, that’s fine
        name: user.name,
        email: user.email,
        role: effectiveRole,
      },
    });
  } catch (err) {
    console.error("Signin error", err);
    return res.status(401).json({ error: "Could not sign in" });
  }
};

// SIGNOUT: clear cookie token
const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "signed out",
  });
};

// Middleware: require valid JWT
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

// Middleware: check user is authorized to access their own resources
const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && String(req.profile._id) === String(req.auth._id);

  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

export default { signup, signin, signout, requireSignin, hasAuthorization };
