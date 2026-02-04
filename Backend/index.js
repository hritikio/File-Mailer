const express = require("express");
const app=express();
require('dotenv').config();
const cors=require('cors');
const mailRoutes = require("./Routes/mailRoutes"); //mailRoutes=router
const authRoutes=require("./Auth/auth")
const cookieParser = require('cookie-parser');

const connectDB=require('./Config/mongodb'); // importing function from mongodb.js

connectDB();
app.use(cookieParser());

app.use(cors()) //we can allow specific site also by origin:"websiteUrl.com"
app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "FileMailer backend is running",
  });
});

app.use("/auth", authRoutes);
app.use("/api",mailRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`)
})


