const express = require("express");
const mongoose = require("mongoose");
const testRouter = require("./routes/test");
const catgsRouter = require("./routes/catgs");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users/users");
const resetPassword = require("./routes/users/user-reset-password");

const auth = require("./helpers/jwt");
require("dotenv/config");

const app = express();
const api = process.env.API;
const port = 3000;

app.use(express.json());
app.use(auth());
app.use(`${api}/test`, testRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/users`, resetPassword);
app.use(`${api}/catgs`, catgsRouter);
app.use(`${api}/products`, productsRouter);

mongoose
  .connect(process.env.CONNECT_STRING)
  .then(() => console.log("Connected"))
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
