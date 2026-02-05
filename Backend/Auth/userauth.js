const router = require("express").Router();
const usermodel = require("../Models/user");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    // auth/signup
    console.log("Signup request:", req.body);
    const user = z.object({
      name: z.string().min(2, "name is too short"),
      email: z.string().email(),
      pass: z.string().min(5, "too short password"),
    });

    const result = await user.safeParseAsync(req.body);

    if (!result.success) {
      return res.status(411).json({
        msg: "Incorrect data ",
        errors: result.error.errors,
      });
    }
    const hashpass = await bcrypt.hash(result.data.pass, 10);

    const newuser = await usermodel.create({
      ...result.data,
      pass: hashpass,
    });
    console.log("newuser created:", newuser._id);

    const token = jwt.sign({ id: newuser._id }, process.env.JWT_ADMIN, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    res.json({
      msg: "user created succesfuly",
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      msg: "Signup failed",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("Login request:", req.body);
    const user = z.object({
      email: z.string().email(),
      pass: z.string().min(2, "pass is too small"),
    });

    const check = user.safeParse(req.body);

    if (!check.success) {
      return res.status(403).json({
        msg: "Invalid wrong credential type",
        errors: check.error.errors,
      });
    }

    const verifieduser = await usermodel.findOne({ email: check.data.email });

    if (!verifieduser) {
      return res.status(403).json({
        msg: "wrong email credential ",
      });
    }

    const ispassvalid = await bcrypt.compare(
      check.data.pass,
      verifieduser.pass,
    );

    if (!ispassvalid) {
      return res.status(403).json({
        msg: "pass is incorrect ",
      });
    }

    const token = jwt.sign({ id: verifieduser._id }, process.env.JWT_ADMIN, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    res.json({
      mssg: "logged in succesfully ",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      msg: "Login failed",
      error: err.message,
    });
  }
});

module.exports = router;
