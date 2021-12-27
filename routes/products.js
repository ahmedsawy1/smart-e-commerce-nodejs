const express = require("express");
const { Catg } = require("../model/catg");
const { UserModel } = require("../model/user");
const { ProductModel } = require("../model/product");
const multer = require("multer");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  let prodList = await ProductModel.find().populate("catg");
  if (!prodList) {
    res.send({ message: "No Products Found" });
    return;
  }

  if (req.query.sortType === "recentlyAdded") {
    prodList = prodList?.sort((a, b) => b.dateCreated - a.dateCreated);
  }

  if (req.query.sortType === "bestSeller") {
    prodList = prodList?.sort((a, b) => b.sold - a.sold);
  }
  if (req.query.sortType === "isFeatured") {
    prodList = prodList?.filter((item) => item.isFeatured === true);
  }

  res.send(prodList);
});

router.get("/search", async (req, res) => {
  let searchedProds = await ProductModel.find().populate("catg");
  if (!searchedProds) {
    res.send({ message: "No Products Found" });
    return;
  }

  searchedProds = searchedProds.filter((results) => {
    if (req.query.name === "") {
      return results;
    } else if (
      results.name.toLocaleLowerCase().includes(req.query.name.toLowerCase())
    ) {
      return results;
    }
  });

  res.send(searchedProds);
});

router.get("/:id", async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    res.send({ message: "No Product Found" });
    return;
  }

  const updatedViews = await ProductModel.findByIdAndUpdate(
    product._id,
    {
      views: product.views + 1,
    },
    {
      new: true,
    }
  );
  res.send(updatedViews);
});

router.get("/filter", async (req, res) => {
  let prodList = await ProductModel.find().populate("catg");

  if (req.query.catg) {
    prodList = prodList.filter((prod) => prod.catg.name === req.query.catg);
  }

  if (req.query.brand) {
    prodList = prodList.filter((prod) => prod.brand === req.query.brand);
  }
  if (req.query.size) {
    prodList = prodList.filter((prod) => prod.size === req.query.size);
  }
  if (+req.query.countInStock) {
    prodList = prodList.filter(
      (prod) => prod.countInStock === +req.query.countInStock
    );
  }

  if (+req.query.startPrice && +req.query.endPrice) {
    prodList = prodList.filter(
      (prod) =>
        prod.price >= +req.query.startPrice && prod.price <= +req.query.endPrice
    );
  }

  if (!prodList) {
    return res.send({ message: "No Prods" });
  }

  res.send(prodList);
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

router.post("/:vendorId", uploadOptions.array("images"), async (req, res) => {
  const foundedCatg = await Catg.findOne({ name: req.body.catg });
  const vendor = await UserModel.findById(req.params.vendorId);

  // const file = req.file;
  // if (!file) return res.status(400).send("No image in the request");

  const files = req.files;

  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }

  // const fileName = file.filename;
  // const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let newProduct = new ProductModel({
    name: req.body.name,
    catg: foundedCatg.id,
    belongTo: vendor.id,
    price: req.body.price,
    details: req.body.details,
    size: req.body.size,
    countInStock: req.body.countInStock,
    brand: req.body.brand,
    isFeatured: req.body.isFeatured,
    // image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
    images: imagesPaths,

    // sold: req.body.sold, // to delete it was just for testing
  });

  newProduct = await newProduct.save();
  res.send(newProduct);
});

router.put("/:vendorId/:prodId", async (req, res) => {
  const foundedCatg = await Catg.findOne({ name: req.body.catg });
  const vendor = await UserModel.findById(req.params.vendorId);
  const foundedProduct = await ProductModel.findById(req.params.prodId);

  //   console.log(vendor.id);
  //   console.log(foundedProduct.belongTo.toString());

  if (vendor.id === foundedProduct.belongTo.toString()) {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.prodId,
      {
        name: req.body.name,
        catg: foundedCatg.id,
        price: req.body.price,
        details: req.body.details,
      },

      { new: true }
    );

    res.send(updatedProduct);
  } else if (vendor.id !== foundedProduct.belongTo.toString()) {
    res.send({ message: "That vendor doesn't have that product" });
  }
});

router.put(
  "/gallery/:prodId",
  uploadOptions.array("images", 10),
  async (req, res) => {
    // if (!mongoose.isValidObjectId(req.params.id)) {
    //   return res.status(400).send("Invalid Product Id");
    // }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await ProductModel.findByIdAndUpdate(
      req.params.prodId,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).send("the gallery cannot be updated!");

    res.send(product);
  }
);

module.exports = router;
