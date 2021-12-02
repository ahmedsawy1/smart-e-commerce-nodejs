const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
});

exports.PaymentModel = mongoose.model("Payment", paymentSchema);
