const express = require("express");
const { Catg } = require("../model/catg");
const { ProductModel } = require("../model/product");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user");
const multer = require("multer");

const router = express.Router();

router.get("/", async (req, res) => {
  const catgsList = await Catg.find();

  if (!catgsList) {
    return res.send({ message: "No Catgs" });
  }

  res.send(catgsList);
});

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.post("/", uploadOptions.single("image"), async (req, res) => {
  const token = req.header("authorization").substring(7);
  const decodedToken = jwt.decode(token, { complete: true });
  const user = await UserModel.findById(decodedToken.payload.userId);

  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (user.role === "admin") {
    let newCatg = new Catg({
      name: req.body.name,
      image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
      backgroundColor: req.body.backgroundColor,
    });

    newCatg = await newCatg.save();
    return res.send(newCatg);
  }

  return res.send("Admin Only Can Add Catgs");
});

// fun 61902226122ee166c1e5983e

router.get("/catgProducts", async (req, res) => {
  const catgData = await Catg.findOne({ name: req.query.catgName });
  const products = await ProductModel.find().populate("catg");
  const filterd = products.filter((prod) => prod.catg.name === catgData.name);

  if (!catgData) {
    return res.send("No catg");
  }
  if (!products) {
    return res.send("No products");
  }

  res.send(filterd);
});

module.exports = router;
