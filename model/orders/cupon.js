const mongoose = require("mongoose");

const cupontSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  val: {
    type: Number,
    required: true,
  },
});

exports.CuponModel = mongoose.model("Cupon", cupontSchema);
