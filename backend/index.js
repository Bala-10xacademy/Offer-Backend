const express =require("express");
const SERVER_PORT=process.env.PORT||8080;
const mongoose=require("mongoose");
const bodyParser = require("body-parser");
const userRoutes=require("./routes/user.js");
const offerRoutes=require("./routes/offer");
const app=express();



mongoose.connect("mongodb://localhost:27017/user").then(()=>{
    console.log("connected to MongoDB succesfully");
}).catch(()=>{
    console.log("Failed to connect Database");
})
app.use(bodyParser.json());
app.listen(SERVER_PORT,()=>{
    console.log("Server Running At "+" "+SERVER_PORT);
})
app.use("/user",userRoutes);
app.use("/offer",offerRoutes);