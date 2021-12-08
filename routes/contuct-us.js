const express = require("express");
const { ContactUsModel } = require("../model/contuct-us");
const router = express.Router();

router.get("/", async (req, res) => {
  const messagesList = await ContactUsModel.find();
  if (!messagesList) {
    res.send("No Messagess");
  }
  res.send(messagesList);
});

router.post("/", async (req, res) => {
  let newMessage = new ContactUsModel({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    message: req.body.message,
  });

  newMessage = await newMessage.save();

  if (!newMessage) return res.status(400).send("The user cannot be created!");

  res.send(newMessage);
});
module.exports = router;
