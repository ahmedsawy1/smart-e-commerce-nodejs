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
  details: {
    type: String,
    default: "A good product",
  },
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

exports.ProductModel = mongoose.model("Product", productSchema);
