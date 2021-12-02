const mongoose = require("mongoose");

const shipingSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

exports.ShipingModel = mongoose.model("Shiping", shipingSchema);
