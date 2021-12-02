const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { UserModel } = require("../../model/user");

const router = express.Router();

router.get("/", async (req, res) => {
  const userList = await UserModel.find();
  if (!userList) {
    res.send("No Users");
  }
  res.send(userList);
});

router.post("/register", async (req, res) => {
  let newUser = new UserModel({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    country: req.body.country,
    city: req.body.city,
  });

  newUser = await newUser.save();

  if (!newUser) return res.status(400).send("The user cannot be created!");

  res.send(newUser);
});

router.post("/login", async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("User Is Not Found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET,
      {
        expiresIn: "1d", // >> on day
      }
    );
    res.status(200).send({
      user: user.email,
      token: token,
    });
  } else {
    return res.status(400).send("Password is wrong");
  }
});

module.exports = router;
