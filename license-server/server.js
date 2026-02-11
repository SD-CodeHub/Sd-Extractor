require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

// ✅ Use frontend domain instead of localhost
app.use(
  cors({
    origin:"https://dataextractor.kalkidigital.com",
    credentials: true,
  })
);

app.use(express.json());

// ✅ DB connection using ENV
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log(`Connected to MySQL database '${process.env.DB_NAME}'`);
});

// Helper: Generate unique device fingerprint hash
function generateFingerprintHash(fingerprint) {
  if (!fingerprint) return null;
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(fingerprint))
    .digest("hex");
}

// 1️⃣ VERIFY LICENSE
app.post("/verify-license", (req, res) => {
  const { licenseKey, deviceFingerprint } = req.body;

  if (!licenseKey)
    return res.status(400).json({ valid: false, message: "License key required" });

  if (!deviceFingerprint)
    return res.status(400).json({ valid: false, message: "Device fingerprint required" });

  const fingerprintHash = generateFingerprintHash(deviceFingerprint);

  db.query(
    `SELECT id, device_fingerprint_hash, activated_at, expiry_date 
     FROM licenses 
     WHERE license_key = ? 
     AND is_active = 1 
     AND (expiry_date IS NULL OR expiry_date > NOW())`,
    [licenseKey],
    (err, results) => {
      if (err) {
        console.error("Verify error:", err);
        return res.status(500).json({ valid: false, message: "Server error" });
      }

      if (results.length === 0) {
        return res.json({ valid: false, message: "Invalid, inactive, or expired key" });
      }

      const record = results[0];

      if (!record.device_fingerprint_hash) {
        return res.json({
          valid: true,
          message: "Key valid - can be activated on this device",
        });
      }

      if (record.device_fingerprint_hash === fingerprintHash) {
        return res.json({
          valid: true,
          message: "Key valid - already bound to this device",
        });
      } else {
        return res.json({
          valid: false,
          message:
            "This key is currently in use on another device. Please log out from the other device first.",
        });
      }
    }
  );
});

// 2️⃣ ADD MEMBER
app.post("/members", (req, res) => {
  const { name, email, mobile, plan } = req.body;

  if (!name || !email || !mobile || !plan)
    return res.status(400).json({ error: "Missing required fields" });

  const licenseKey =
    "KDE-" + Math.random().toString(36).substring(2, 11).toUpperCase();

  db.query(
    "INSERT INTO licenses (license_key, name, email, mobile, plan, is_active, created_at) VALUES (?, ?, ?, ?, ?, 0, NOW())",
    [licenseKey, name, email, mobile, plan],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        success: true,
        licenseKey,
        id: result.insertId,
        message: "Member added. Key generated (awaiting activation)",
      });
    }
  );
});

// 3️⃣ GET MEMBERS
app.get("/members", (req, res) => {
  db.query(
    "SELECT id, license_key, name, email, mobile, plan, is_active, activated_at, expiry_date, device_fingerprint_hash, created_at FROM licenses ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// 4️⃣ ACTIVATE / BLOCK
app.put("/members/:id/status", (req, res) => {
  const { id } = req.params;
  const { is_active, deviceFingerprint } = req.body;

  if (typeof is_active !== "boolean")
    return res.status(400).json({ error: "is_active must be boolean" });

  if (is_active && !deviceFingerprint)
    return res.status(400).json({ error: "Device fingerprint required" });

  const fingerprintHash = is_active
    ? generateFingerprintHash(deviceFingerprint)
    : null;

  if (is_active) {
    db.query("SELECT plan FROM licenses WHERE id = ?", [id], (err, rows) => {
      if (err || rows.length === 0)
        return res.status(500).json({ error: "Failed to fetch plan" });

      let expirySql = "NULL";
      if (rows[0].plan === "monthly")
        expirySql = "DATE_ADD(NOW(), INTERVAL 30 DAY)";
      if (rows[0].plan === "yearly")
        expirySql = "DATE_ADD(NOW(), INTERVAL 365 DAY)";

      db.query(
        `UPDATE licenses 
         SET is_active = 1, 
             activated_at = NOW(), 
             expiry_date = ${expirySql},
             device_fingerprint_hash = ?
         WHERE id = ?`,
        [fingerprintHash, id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            success: true,
            message: "Key activated and bound to this device",
          });
        }
      );
    });
  } else {
    db.query(
      "UPDATE licenses SET is_active = 0, device_fingerprint_hash = NULL WHERE id = ?",
      [id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          success: true,
          message: "Key blocked and device unbound",
        });
      }
    );
  }
});

// 5️⃣ LOGOUT
app.post("/logout", (req, res) => {
  const { licenseKey } = req.body;

  if (!licenseKey)
    return res.status(400).json({ error: "License key required" });

  db.query(
    "UPDATE licenses SET device_fingerprint_hash = NULL WHERE license_key = ?",
    [licenseKey],
    (err) => {
      if (err) return res.status(500).json({ error: "Server error" });

      res.json({
        success: true,
        message: "Logged out successfully. Key is free now.",
      });
    }
  );
});

// 6️⃣ DELETE MEMBER
app.delete("/members/:id", (req, res) => {
  db.query("DELETE FROM licenses WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ✅ Use ENV port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`License server running on https://dataextractor.kalkidigital.com:${PORT}`);
});
