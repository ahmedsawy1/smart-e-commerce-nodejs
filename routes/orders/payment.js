const express = require("express");
const { PaymentModel } = require("../../model/orders/payment");

const router = express.Router();

router.get("/", async (req, res) => {
  let payMethods = await PaymentModel.find();
  res.send(payMethods);
});

router.post("/", async (req, res) => {
  // Dont forget , Admin only can post shiping methods

  let newpaymentMethod = new PaymentModel({
    name: req.body.name,
    type: req.body.type,
    tax: req.body.tax,
  });

  newpaymentMethod = await newpaymentMethod.save();
  res.send(newpaymentMethod);
});

module.exports = router;
