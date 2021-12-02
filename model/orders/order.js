const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  shipingMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shiping",
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

exports.OrderModel = mongoose.model("Order", orderSchema);

/**
Order Example:
{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "61993a1d098a1515a277ab16"
        },
        {
            "quantity": 2,
            "product" : "61993a1d098a1515a277ab16"
        }
    ],
    "user": "618f8793d640da50712d9ff8"
}
 */
