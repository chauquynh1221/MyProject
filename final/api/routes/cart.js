const { Router } = require("express");
const CryptoJS = require("crypto-js");
const { verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin } = require("./verifytoken");
const Cart = require("../models/Cart")
const router = require("express").Router();

// Tạo giỏ hàng mới 
router.post("/",verifyToken, async (req,res)=>{
    const newCart  = new Cart(req.body)
    try {
        const saveCart = await newCart.save();
        res.status(200).json(saveCart)
    } catch (err) {
        res.status(500).json(err)
    }
})


// //cập nhật 
router.put("/:id",verifyTokenAndAuthorization,async(req, res)=>{
    try{
        const updateCart = await Cart.findByIdAndUpdate(
            req.params.id,{
                $set:req.body,
            },{
                new : true
            }
        ) 
        res.status(200).json(updateCart);
    }catch(err){
        res.status(500).json(err);
    }
})

//Xóa
router.delete("/:id",verifyTokenAndAuthorization , async(req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Đã xóa khỏi giỏ hàng")
    } catch (err) {
        res.status(500).json(err)
    }
})

//Lấy thông tin giỏ hàng 
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// //Lấy thông tin all gio hang  
router.get("/",verifyTokenAndAdmin,async (req,res)=>{
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router