const mongoose = require("mongoose");

const catgSchema = mongoose.Schema({
  name: String,
  backgroundColor: {
    type: String,
    default: "#18F385",
  },
});

catgSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

catgSchema.set("toJSON", {
  virtuals: true,
});

exports.Catg = mongoose.model("Catg", catgSchema);
