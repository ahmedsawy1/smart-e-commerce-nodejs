const express = require("express");
const { Catg } = require("../model/catg");
const { ProductModel } = require("../model/product");

const router = express.Router();

router.get("/", async (req, res) => {
  const catgsList = await Catg.find();

  res.send(catgsList);
});

router.post("/", async (req, res) => {
  let newCatg = new Catg({
    name: req.body.name,
    backgroundColor: req.body.backgroundColor,
  });

  newCatg = await newCatg.save();
  res.send(newCatg);
});

// fun 61902226122ee166c1e5983e

router.get("/catgProducts", async (req, res) => {
  const catgData = await Catg.findOne({ name: req.query.catgName });
  const products = await ProductModel.find().populate("catg");
  const filterd = products.filter((prod) => prod.catg.name === catgData.name);

  res.send(filterd);
});

module.exports = router;
