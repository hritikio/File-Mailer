const router = require("express").Router();
const usermodel = require("../Models/user");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  // auth/signup
  const user = z.object({
    name: z.string().min(2, "name is too short"),
    email: z.string().email(),
    pass: z.string().min(5, "too short password"),
  });

  const result = await user.safeParseAsync(req.body);
  //console.log(result);

  if (!result.success) {
    return res.status(411).json({
      msg: "Incorrect data ",
      result: result.error.error,
    });
  }
  const hashpass = await bcrypt.hash(result.data.pass, 10);
  //console.log(hashpass);

  const newuser = await usermodel.create({
    ...result.data,
    pass: hashpass,
  });
  result.data.pass = hashpass;
  console.log("newuser is ", newuser);
  console.log("newuser is ", newuser._id);

  const token = jwt.sign({ id: newuser._id }, process.env.JWT_ADMIN, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  console.log("token is ", token);

  res.json({
    msg: "user created succesfuly",
    token,
    // data:result.data
  });
});

router.post("/login", async (req, res) => {});

module.exports = router;
