const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mailRoutes = require("./Routes/mailRoutes"); //mailRoutes=router
const userRoutes = require("./Auth/userauth");
const adminRoutes = require("./Auth/adminauth");
const cookieParser = require("cookie-parser");

const connectDB = require("./Config/mongodb"); // importing function from mongodb.js

connectDB();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "FileMailer backend is running",
  });
});

app.use("/auth/user", userRoutes);
app.use("/auth/admin", adminRoutes);
app.use("/api", mailRoutes);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
