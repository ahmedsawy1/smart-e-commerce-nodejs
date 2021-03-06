const express = require("express");
const { Test } = require("../model/test");

const router = express.Router();

router.post("/", async (req, res) => {
  let newTest = new Test({
    name: req.body.name,
  });

  newTest = await newTest.save();
  res.send(req.t("test") + newTest);
});

router.get("/", async (req, res) => {
  let tests = await Test.find();

  res.status(200).send(tests);
});

module.exports = router;
