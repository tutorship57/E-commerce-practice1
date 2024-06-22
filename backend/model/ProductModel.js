const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/e-commerce")

const Product = mongoose.model("Product",{
    id:{
        type:Number,
        require:true,
    },
    name:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true,
    },
    new_price:{
        type:Number,
        require:true
    },
    old_price:{
        type:Number,
        require:true,
    },
    category:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true
    },
})

module.exports = Product
