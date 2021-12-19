const express = require("express");
const { AddressModel } = require("../../model/user/address");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../../model/user");

router.get("/", async (req, res) => {
  const addressessList = await AddressModel.find();
  if (!addressessList) {
    res.send({ message: "No addressessList" });
  }
  res.send(addressessList);
});

router.delete("/", async (req, res) => {
  await AddressModel.remove();

  res.send({ message: "deleted" });
});

router.post("/", async (req, res) => {
  const token = req.header("authorization").substring(7);
  const decodedToken = jwt.decode(token, { complete: true });
  const userId = decodedToken.payload.userId;
  console.log(userId);

  let newAddress = new AddressModel({
    name: req.body.name,
    phone: req.body.phone,
    Country: req.body.Country,
    Governorate: req.body.Governorate,
    City: req.body.City,
    zip: req.body.zip,
    Street: req.body.Street,
    BuildingName: req.body.BuildingName,
  });

  newAddress = await newAddress.save();

  if (!newAddress)
    return res.status(400).send("The new address cannot be created!");

  const { addressess } = await UserModel.findById(userId).populate(
    "addressess"
  );

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      addressess: [...addressess, newAddress._id],
    },
    { new: true }
  );

  res.send(newAddress);
});

module.exports = router;

// router.post("/:userId/addAddress", async (req, res) => {
//   const { addressess } = await UserModel.findById(req.params.userId).populate(
//     "addressess"
//   );
//   console.log(addressess);
//   const updatedUser = await UserModel.findByIdAndUpdate(
//     req.params.userId,
//     {
//       addressess: [...addressess, req.body.newAddress],
//     },
//     { new: true }
//   );

//   res.send(updatedUser);
// });
// module.exports = router;
