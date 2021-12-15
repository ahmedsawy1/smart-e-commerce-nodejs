const express = require("express");
const { UserModel } = require("../../model/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

router.put("/edit/password", async (req, res) => {
  const token = req.header("authorization").substring(7);
  const decodedToken = jwt.decode(token, { complete: true });
  const userId = decodedToken.payload.userId;
  const user = await UserModel.findById(userId);
  if (user && bcrypt.compareSync(req.body.oldPassword, user.passwordHash)) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        passwordHash: bcrypt.hashSync(req.body.newPassword, 10),
      },
      { new: true }
    );

    res.send(updatedUser);
  } else {
    res.send({ message: req.t("Password is Wrong") });
  }
});

module.exports = router;
