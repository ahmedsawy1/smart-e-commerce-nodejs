const express = require("express");
const bcrypt = require("bcryptjs");
const { UserModel } = require("../../model/user");

const router = express.Router();

router.post("/forget-password", async (req, res) => {
  const userData = await UserModel.findOne({ email: req.body.email });
  if (!userData) {
    res.send("No User Is Registered With That Email");
    return;
  }

  const link = `http://localhost:3000/api/v1/users/reset-password/${userData._id}`;
  console.log(link);
  res.send("Password Reset Link Was Sent Succsessfuly");
});

router.get("/reset-password/:id", async (req, res) => {
  const UserData = await UserModel.findById(req.params.id);
  if (!UserData) {
    res.send("No User");
    return;
  }
  res.send(UserData);
});

router.put("/reset-password/:id", async (req, res) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      passwordHash: bcrypt.hashSync(req.body.newPassword, 10),
    },
    { new: true }
  );
  if (!updatedUser) {
    res.send("No User");
    return;
  }
  res.send("Password Updated Succesfully");
});

module.exports = router;
