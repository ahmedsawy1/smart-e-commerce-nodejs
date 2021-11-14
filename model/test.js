const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
  name: String,
});

exports.Test = mongoose.model("Test", testSchema);
