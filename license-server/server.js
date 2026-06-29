require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "dev_insecure_secret_change_me";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

app.use(
  cors({
    // The user website (Vite) AND the packed extension call this API.
    // Chrome extensions send an `chrome-extension://...` origin, so we reflect
    // any origin here for now; lock this down to known origins in production.
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://codehubsd_db_user:wjmoNRCpeJUHIwfy@cluster0.4wmar5d.mongodb.net/extentions?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// ====================== SCHEMAS ======================

// User accounts (Gmail + password). These are the people who sign up on the
// website, request access, and later activate the extension with a license key.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: String, default: "" },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// License / membership. A license can be created by an admin (legacy flow) or
// requested by a signed-in user (self-service flow). `user` links it back to
// the account that requested it so the user dashboard can show their history.
const licenseSchema = new mongoose.Schema({
  license_key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  plan: { type: String, enum: ['monthly', 'yearly'], required: true },
  is_active: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  requested_at: Date,
  activated_at: Date,
  expiry_date: Date,
  device_fingerprint_hash: String,
  created_at: { type: Date, default: Date.now }
});

const License = mongoose.model("License", licenseSchema);

// ====================== HELPERS ======================

// Helper: Generate fingerprint hash
function generateFingerprintHash(fingerprint) {
  if (!fingerprint) return null;
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(fingerprint))
    .digest("hex");
}

function generateLicenseKey() {
  return "KDE-" + Math.random().toString(36).substring(2, 11).toUpperCase();
}

function signUserToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

// Derive a friendly status string for a license (used by the user dashboard).
function licenseStatus(license) {
  if (license.expiry_date && new Date(license.expiry_date) < new Date()) return "expired";
  if (license.is_active) return "active";
  if (license.activated_at) return "blocked";
  return "pending"; // requested, awaiting admin verification
}

// Auth middleware for user-only routes. Reads `Authorization: Bearer <token>`.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Authentication required" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

// ====================== USER AUTH ROUTES ======================

// Sign up with name, email (Gmail), mobile, password.
app.post("/auth/signup", async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      mobile: mobile || "",
      password_hash
    });

    res.json({
      success: true,
      token: signUserToken(user),
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Log in with email + password.
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      success: true,
      token: signUserToken(user),
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Current logged-in user's profile.
app.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password_hash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== USER SELF-SERVICE ROUTES ======================

// A signed-in user requests access. This is the same form admins use to add a
// member, but it's tied to the user's account and starts inactive (pending),
// awaiting admin verification.
app.post("/request-access", requireAuth, async (req, res) => {
  const { mobile, plan } = req.body;
  if (!plan || !["monthly", "yearly"].includes(plan)) {
    return res.status(400).json({ error: "A valid plan (monthly/yearly) is required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Block a duplicate pending/active request so users don't spam keys.
    const existing = await License.findOne({
      user: user._id,
      $or: [{ is_active: true }, { activated_at: null }]
    });
    if (existing) {
      return res.status(409).json({
        error: "You already have a license request in progress.",
        license: { license_key: existing.license_key, status: licenseStatus(existing) }
      });
    }

    if (mobile) {
      user.mobile = mobile;
      await user.save();
    }

    const license = await License.create({
      license_key: generateLicenseKey(),
      name: user.name,
      email: user.email,
      mobile: mobile || user.mobile || "N/A",
      plan,
      user: user._id,
      is_active: false,
      requested_at: new Date()
    });

    res.json({
      success: true,
      message: "Request submitted. Your license is pending admin verification.",
      license: { license_key: license.license_key, status: licenseStatus(license) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// The logged-in user's licenses (their request history + current status).
app.get("/my-licenses", requireAuth, async (req, res) => {
  try {
    const licenses = await License.find({ user: req.user.id }).sort({ created_at: -1 });
    res.json(
      licenses.map(l => ({
        _id: l._id,
        license_key: l.license_key,
        plan: l.plan,
        status: licenseStatus(l),
        is_active: l.is_active,
        requested_at: l.requested_at,
        activated_at: l.activated_at,
        expiry_date: l.expiry_date,
        created_at: l.created_at
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== ADMIN AUTH ======================

// Admin login. Returns a token the admin panel can send on protected routes.
// (Member-management routes below are left open for backward compatibility with
// the current admin panel; enforce `requireAuth`-style admin checks when the
// admin frontend is wired to send this token.)
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin", username }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ success: true, token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

// ====================== EXTENSION ROUTES ======================

// 1️⃣ VERIFY LICENSE
app.post("/verify-license", async (req, res) => {
  const { licenseKey, deviceFingerprint } = req.body;

  if (!licenseKey) {
    return res.status(400).json({
      valid: false,
      message: "License key required"
    });
  }

  const fingerprintHash = deviceFingerprint
    ? generateFingerprintHash(deviceFingerprint)
    : null;

  try {
    const key = licenseKey.toUpperCase().trim();

    // Look the key up first so we can return a specific reason (pending /
    // expired / blocked) instead of a generic "invalid".
    const license = await License.findOne({ license_key: key });

    if (!license) {
      return res.json({ valid: false, reason: "not_found", message: "License key not found." });
    }

    const status = licenseStatus(license);
    if (status === "pending") {
      return res.json({
        valid: false,
        reason: "pending",
        message: "Your license has not been verified by the admin yet."
      });
    }
    if (status === "expired") {
      return res.json({
        valid: false,
        reason: "expired",
        message: "Your plan has expired. Please renew to continue."
      });
    }
    if (status === "blocked" || !license.is_active) {
      return res.json({
        valid: false,
        reason: "blocked",
        message: "This license has been blocked. Contact the admin."
      });
    }

    // Active and not expired — handle device binding.
    if (license.device_fingerprint_hash) {
      if (!fingerprintHash || license.device_fingerprint_hash === fingerprintHash) {
        return res.json({ valid: true, message: "Key valid - device bound" });
      }
      return res.json({
        valid: false,
        reason: "other_device",
        message: "This key is currently in use on another device."
      });
    }

    // First device to verify this active key binds itself to it.
    if (fingerprintHash) {
      license.device_fingerprint_hash = fingerprintHash;
      await license.save();
    }
    return res.json({
      valid: true,
      message: "Key valid - activated on this device"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, message: "Server error" });
  }
});

// ====================== ADMIN MEMBER ROUTES ======================

// 2️⃣ ADD MEMBER — also creates a login account (with password) for the user
// so admin-created members can sign in to their dashboard.
app.post("/members", async (req, res) => {
  const { name, email, mobile, plan, password } = req.body;
  if (!name || !email || !mobile || !plan || !password) {
    return res.status(400).json({ error: "Name, email, mobile, plan and password are all required" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const licenseKey = generateLicenseKey();
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Create the user account if it doesn't exist; otherwise reuse it and
    // refresh the password the admin just set (so the user can log in).
    let user = await User.findOne({ email: normalizedEmail });
    const password_hash = await bcrypt.hash(password, 10);
    if (!user) {
      user = await User.create({ name, email: normalizedEmail, mobile, password_hash });
    } else {
      user.name = name;
      user.mobile = mobile;
      user.password_hash = password_hash;
      await user.save();
    }

    const newLicense = await License.create({
      license_key: licenseKey,
      name,
      email: normalizedEmail,
      mobile,
      plan,
      user: user._id,
      is_active: false
    });

    res.json({
      success: true,
      licenseKey,
      id: newLicense._id,
      message: "Member added with login account. Key generated (awaiting activation)",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 3️⃣ GET MEMBERS
app.get("/members", async (req, res) => {
  try {
    const members = await License.find({})
      .sort({ created_at: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4️⃣ ACTIVATE / BLOCK
app.put("/members/:id/status", async (req, res) => {
  const { id } = req.params;
  const { is_active, deviceFingerprint } = req.body;

  if (typeof is_active !== "boolean") {
    return res.status(400).json({ error: "is_active must be boolean" });
  }

  try {
    const license = await License.findById(id);
    if (!license) return res.status(404).json({ error: "Not found" });

    if (is_active) {
      // Bind to a device only if a fingerprint is supplied; for self-service
      // users the binding happens later when they verify in the extension.
      const fingerprintHash = deviceFingerprint
        ? generateFingerprintHash(deviceFingerprint)
        : license.device_fingerprint_hash || null;
      let expiry_date = null;

      if (license.plan === "monthly") expiry_date = new Date(Date.now() + 30 * 86400000);
      if (license.plan === "yearly") expiry_date = new Date(Date.now() + 365 * 86400000);

      license.is_active = true;
      license.activated_at = new Date();
      license.expiry_date = expiry_date;
      license.device_fingerprint_hash = fingerprintHash;
      await license.save();

      res.json({ success: true, message: "Key activated" });
    } else {
      license.is_active = false;
      license.device_fingerprint_hash = null;
      await license.save();
      res.json({ success: true, message: "Key blocked and device unbound" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5️⃣ LOGOUT (extension device unbind)
app.post("/logout", async (req, res) => {
  const { licenseKey } = req.body;
  if (!licenseKey) return res.status(400).json({ error: "License key required" });

  try {
    await License.updateOne(
      { license_key: licenseKey.toUpperCase() },
      { device_fingerprint_hash: null }
    );
    res.json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 6️⃣ DELETE MEMBER
app.delete("/members/:id", async (req, res) => {
  try {
    await License.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// On Vercel the app runs as a serverless function, so we export it as the
// request handler instead of opening a port. Locally we still listen.
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
