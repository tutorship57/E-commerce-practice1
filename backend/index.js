const port = 4000;
const express = require("express")
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { deflate } = require("zlib");
const fs = require('fs')
const router = require('./Router/routing')
app.use(express.json());
app.use(cors());
app.use("/images",express.static('upload/images'))
app.use(router)
//database connect 

app.listen(port,(err)=>{
    if (!err) {
        console.log("server running on port "+port);
    }else{
        console.log("Error :"+err);
    }
})

