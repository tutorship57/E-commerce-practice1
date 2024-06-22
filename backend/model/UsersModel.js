const mongoose = require('mongoose')

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

module.exports = Users