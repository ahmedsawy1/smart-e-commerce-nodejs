const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  Country: {
    type: String,
    required: true,
  },
  Governorate: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    default: "",
  },
  Street: {
    type: String,
    required: true,
  },
  BuildingName: {
    type: String,
    required: true,
  },
});

addressSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

addressSchema.set("toJSON", {
  virtuals: true,
});

exports.AddressModel = mongoose.model("Address", addressSchema);
