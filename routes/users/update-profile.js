const express = require("express");
const { UserModel } = require("../../model/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.put("/edit", async (req, res) => {
  const token = req.header("authorization").substring(7);
  const decodedToken = jwt.decode(token, { complete: true });
  const userId = decodedToken.payload.userId;

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      country: req.body.country,
    },
    { new: true }
  );

  res.send(updatedUser);
});

module.exports = router;
