const express = require('express')
const router = express.Router()
const multer = require('multer')
const Product = require('../model/ProductModel')
const Users = require('../model/UsersModel')
// api creation
router.get("/",(req,res)=>{
    console.log("kuy");
    return res.send("Express router is running")
})

// image storage engine
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})


 const upload = multer({storage:storage})

//creating upload Endpoint for images
router.post("/upload",upload.single('product'),(req,res)=>{

    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating product

// Shema creating for User model



// Creating Endpoint for registering the user 
router.post('/signup',async (req,res)=>{
    let check = await Users.findOne({email:req.body.email})
    if (check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {};
    for (let i = 0; i <300; i++) {
        cart[i] = 0;   
    }
    const user = new Users({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//API remove product
router.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log("Remove");
    res.json({
        success:true,
        name:req.body.name
    })
})

//
router.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email})
    if(user){
        const passCompare = req.body.password === user.password ;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"wrong password"})
        }
    }
    else{
        res.json({success:false,errors:"wrong Email Id"})
    }
})

//API 
router.get('/allproducts',async (req,res)=>{
    let products = await Product.find({})
    console.log("All Product Fetched");
    res.send(products);
})

//creating endpoint for newcollection data
router.get('/newcollection',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("Newcollection Fetch");
    res.send(newcollection)
})

//creatong endpoint for popular in women section 
router.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"})
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women)
})



//creating middleware to fetch user 
    const fetchUser = async (req,res,next) =>{
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }else{
            try {
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user
                next();
            } catch (error) {
                res.status(401).send({errors:"please authenticate with valid token"})
            }
        }
    }

//creating endpoint for adding products in cartdata
router.post('/addtocart',fetchUser,async (req,res)=>{
    console.log(req.body,req.user);
    console.log("added",req.body.itemId);
    let userData =await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added")
})

//creating endpoint to remove product from cartdata
router.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log(req.body,req.user);
    console.log("removed",req.body.itemId);
    let userData =await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0){
        userData.cartData[req.body.itemId] -=1;
    }
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed")
})

//creaet endpoint to get cartData
router.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

router.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0]
        id = last_product.id+1
    }else{
        id = 1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price, 
    });
    console.log(product);
    await product.save();
    console.log("Saves");
    res.json({success:true
        ,name:req.body.name
    })
})

module.exports = router  