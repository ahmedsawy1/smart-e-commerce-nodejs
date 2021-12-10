const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  catg: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Catg",
  },
  belongTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "BelongTo",
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
    // required: true,
  },
  size: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    default: "It's a good product",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  sold: {
    type: Number,
    // required: true,
    default: 0,
  },
  ratings: {
    type: Number,
  },
  comments: [
    {
      type: String,
    },
  ],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: "",
  },
  images: [
    {
      type: String,
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

exports.ProductModel = mongoose.model("Product", productSchema);
