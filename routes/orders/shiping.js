const express = require("express");
const { ShipingModel } = require("../../model/orders/shiping");

const router = express.Router();

router.get("/", async (req, res) => {
  let shipingMethods = await ShipingModel.find();
  res.send(shipingMethods);
});

router.post("/", async (req, res) => {
  // Dont forget , Admin only can post shiping methods

  let newShipingMethod = new ShipingModel({
    name: req.body.name,
    type: req.body.type,
    cost: req.body.cost,
  });

  newShipingMethod = await newShipingMethod.save();
  res.send(newShipingMethod);
});

module.exports = router;
