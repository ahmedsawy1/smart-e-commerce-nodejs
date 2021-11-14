const express = require("express");
const { Catg } = require("../model/catg");
const { ProductModel } = require("../model/product");
const { UserModel } = require("../model/user");

const router = express.Router();

router.get("/", async (req, res) => {
  const prodList = await ProductModel.find().populate("catg");
  res.send(prodList);
});

router.post("/:vendorId", async (req, res) => {
  const foundedCatg = await Catg.findOne({ name: req.body.catg });
  const vendor = await UserModel.findById(req.params.vendorId);

  console.log(vendor.id);

  let newProduct = new ProductModel({
    name: req.body.name,
    catg: foundedCatg.id,
    belongTo: vendor.id,
    price: req.body.price,
    details: req.body.details,
  });

  newProduct = await newProduct.save();
  res.send(newProduct);
});

router.put("/:vendorId/:prodId", async (req, res) => {
  const foundedCatg = await Catg.findOne({ name: req.body.catg });
  const vendor = await UserModel.findById(req.params.vendorId);
  const foundedProduct = await ProductModel.findById(req.params.prodId);

  //   console.log(vendor.id);
  //   console.log(foundedProduct.belongTo.toString());

  if (vendor.id === foundedProduct.belongTo.toString()) {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.prodId,
      {
        name: req.body.name,
        catg: foundedCatg.id,
        price: req.body.price,
        details: req.body.details,
      },

      { new: true }
    );

    res.send(updatedProduct);
  } else if (vendor.id !== foundedProduct.belongTo.toString()) {
    res.send("That vendor doesn't have that product");
  }
});

module.exports = router;
