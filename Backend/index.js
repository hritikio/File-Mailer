const express = require("express");
const app=express();
require('dotenv').config();
const cors=require('cors');
const mailRoutes = require("./Routes/mailRoutes"); //mailRoutes=router


const connectDB=require('./Config/mongodb'); // importing function from mongodb.js

connectDB();

app.use(cors()) //we can allow specific site also by origin:"websiteUrl.com"
app.use(express.json());



app.use("/api",mailRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`)
})


