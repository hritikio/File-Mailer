//only login endpoint for admin
const router = require("express").Router();
const z = require("zod");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const body = z.object({
    email: z.string().email(),
    pass: z.string().min(2, "pass is too small"),
  });

  const check = body.safeParse(req.body);

  console.log("check is ", check);

  if (!check) {
    return res.json({
      msg: "Input is in wrong from",
    });
  }

  if (
    check.data.email === process.env.ADMIN_EMAIL &&
    check.data.pass === process.env.ADMIN_PASS
  ) {
    const token = jwt.sign(
      {
        name: process.env.ADMIN_NAME,
      },
      process.env.ADMIN_PASS,
      {
        expiresIn: "7d",
      },
    );

    console.log("jwt is ", token);

    res.cookie("jwtAdmin", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Admin Logged in succesfully ",
      token,
    });
  } else {
    res.status(411).json({
      msg: "Admin Credentials are wrong ",
    });
  }
});

module.exports = router;
