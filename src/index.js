// require("dotenv").config({ path: "./.env" });
import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
  
  });
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express";
import connectDB from "./db/db.js";
import { app } from "./app.js";



connectDB()
.then(()=>{
  app.listen(process.env.PORT|| 8000, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
  })

}
)
.catch((err)=>{
  console.log("there is error while connecting mongodb",err);
})


/*
const app = express()
(async()=>{
    try {
        
      await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      app.on("error", (err)=>{
        console.log("ERROR:", err)
        throw err
      })
      app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
      })
    }
catch (error) {
        console.error("ERROR:", error)
        throw error

    }
})()
    */
