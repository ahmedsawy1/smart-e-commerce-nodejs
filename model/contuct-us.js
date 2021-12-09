const mongoose = require("mongoose");

const ContactUsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

ContactUsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ContactUsSchema.set("toJSON", {
  virtuals: true,
});

exports.ContactUsModel = mongoose.model("ContactUs", ContactUsSchema);
