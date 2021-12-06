const express = require("express");
const { Test } = require("../model/test");

const router = express.Router();

router.post("/", async (req, res) => {
  let newTest = new Test({
    name: req.body.name,
  });

  newTest = await newTest.save();
  res.send(req.t("test"));
});

module.exports = router;
