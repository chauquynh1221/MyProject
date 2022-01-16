const { Router } = require("express");
const CryptoJS = require("crypto-js");
const { verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin } = require("./verifytoken");
const Product = require("../models/Product")
const router = require("express").Router();

// Tạo sản phẩm mới 
router.post("/",verifyTokenAndAuthorization, async (req,res)=>{
    const newProduct  = new Product(req.body)
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})


//cập nhật 
router.put("/:id",verifyTokenAndAdmin,async(req, res)=>{
    try{
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,{
                $set:req.body,
            },{
                new : true
            }
        ) 
        res.status(200).json(updateProduct);
    }catch(err){
        res.status(500).json(err);
    }
})

//Xóa
router.delete("/:id",verifyTokenAndAdmin , async(req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Đã xóa sản phẩm")
    } catch (err) {
        res.status(500).json(err)
    }
})

//Lấy thông tin sản phẩm 
router.get("/find/:id"
  ,verifyTokenAndAuthorization 
  , async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json(err)
    }
})

//Lấy thông tin all sản phẩm 
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});


// //Lấy số liệu thống kê  user 
router.get("/stats",verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await Product.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
              $project: {
                month: { $month: "$createdAt" },
              },
            },
            {
              $group: {
                _id: "$month",
                total: { $sum: 1 },
              },
            },
          ]);
          res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router