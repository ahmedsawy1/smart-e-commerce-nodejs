const express = require("express");
const { Catg } = require("../model/catg");
const { UserModel } = require("../model/user");
const { ProductModel } = require("../model/product");

const router = express.Router();

router.get("/", async (req, res) => {
  const prodList = await ProductModel.find().populate("catg");
  res.send(prodList);
});

router.get("/:id", async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    res.send("No Product Found");
    return;
  }
  res.send(product);
});

router.get("/recentlyAdded", async (req, res) => {
  const prodList = await ProductModel.find().populate("catg");

  if (!prodList) {
    res.send("No Products Yes");
    return;
  }

  const recAdded = prodList?.sort((a, b) => b.dateCreated - a.dateCreated);
  res.send(recAdded);
});

router.get("/bestSeller", async (req, res) => {
  const prodList = await ProductModel.find().populate("catg");

  if (!prodList) {
    res.send("No Products Yes");
    return;
  }

  const bestSellerProds = prodList?.sort((a, b) => b.sold - a.sold);
  res.send(bestSellerProds);
});

router.get("/isFeatured", async (req, res) => {
  const prodList = await ProductModel.find().populate("catg");

  if (!prodList) {
    res.send("No Products Yes");
    return;
  }

  const isFeaturedProds = prodList?.filter((item) => item.isFeatured === true);
  res.send(isFeaturedProds);
});

router.get("/filter", async (req, res) => {
  let prodList = await ProductModel.find().populate("catg");

  if (req.query.catg) {
    prodList = prodList.filter((prod) => prod.catg.name === req.query.catg);
  }

  if (req.query.brand) {
    prodList = prodList.filter((prod) => prod.brand === req.query.brand);
  }
  if (req.query.size) {
    prodList = prodList.filter((prod) => prod.size === req.query.size);
  }
  if (+req.query.countInStock) {
    prodList = prodList.filter(
      (prod) => prod.countInStock === +req.query.countInStock
    );
  }

  if (+req.query.startPrice && +req.query.endPrice) {
    prodList = prodList.filter(
      (prod) =>
        prod.price >= +req.query.startPrice && prod.price <= +req.query.endPrice
    );
  }

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
    size: req.body.size,
    countInStock: req.body.countInStock,
    brand: req.body.brand,
    isFeatured: req.body.isFeatured,
    // sold: req.body.sold, // to delete it was just for testing
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
