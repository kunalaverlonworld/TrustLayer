import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Company } from "../models/Company";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
      isActive: true,
    }).select("+passwordHash");

    console.log(`[LOGIN_DEBUG] Email: "${email}"`);
    console.log(`[LOGIN_DEBUG] User found: ${!!user}`);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let isMatch = await bcrypt.compare(password, user.passwordHash);
    
    // TEMPORARY FALLBACK: Check if password was stored as plain text
    if (!isMatch && password === user.passwordHash) {
      console.log("[LOGIN_DEBUG] Plain text match found! Password was not hashed in DB.");
      isMatch = true;
    }
    
    console.log(`[LOGIN_DEBUG] Final Access Match: ${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        companyId: user.companyId,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error });
  }
});

// ── POST /api/auth/sso ────────────────────────────────────────────────────────
// Called by TrustLayer landing page to get a dashboard JWT without re-login.
// Body: { email, name, planName, licenseId }
// Flow: find/create user in dashboard DB → return JWT → frontend redirects to /sso
router.post("/sso", async (req, res) => {
  try {
    const { email, name, planName, licenseId } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    // Find or auto-create user
    let user = await User.findOne({ email });

    if (!user) {
      // Auto-create user from LMS — get or create default company
      let company = await Company.findOne({ companyCode: "DEFAULT" });
      if (!company) {
        company = await Company.create({
          name: "Default Company",
          companyCode: "DEFAULT",
          subscriptionPlan: planName ?? "basic",
        });
      }

      // Create user with a random placeholder password (they won't use it)
      const passwordHash = await bcrypt.hash(`sso_${Date.now()}`, 10);
      user = await User.create({
        companyId:    company._id,
        name:         name || email.split("@")[0],
        email:        email.toLowerCase().trim(),
        role:         "manager",
        passwordHash,
        isActive:     true,
      });
    } else {
      // If user already exists, update their company's subscription plan to match
      const company = await Company.findById(user.companyId);
      if (company && planName && company.subscriptionPlan !== planName) {
        company.subscriptionPlan = planName;
        await company.save();
      }
    }

    const token = jwt.sign(
      {
        userId:    user._id,
        companyId: user.companyId,
        role:      user.role,
        planName:  planName ?? "basic",
        licenseId: licenseId ?? "",
        sso:       true,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      planName: planName ?? "basic",
      licenseId: licenseId ?? "",
    });
  } catch (error: any) {
    console.error("[SSO] error:", error.message);
    return res.status(500).json({ message: "SSO failed", error: error.message });
  }
});

export default router;
