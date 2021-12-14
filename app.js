const express = require("express");
const mongoose = require("mongoose");
const i18Next = require("i18next");
const backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

const testRouter = require("./routes/test");
const catgsRouter = require("./routes/catgs");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users/users");
const addressRouter = require("./routes/users/addresses");
const updateProfile = require("./routes/users/update-profile");
const resetPassword = require("./routes/users/user-reset-password");
const ordersRouter = require("./routes/orders/orders");
const shipingRouter = require("./routes/orders/shiping");
const paymentRouter = require("./routes/orders/payment");

const auth = require("./helpers/jwt");
require("dotenv/config");

const app = express();
const api = process.env.API;
const port = 3000;

app.get(`/api/v1/`, async (req, res) => {
  res.send("Hello");
  console.log(process.env.API);
});

i18Next
  .use(backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "locales/{{lng}}/translation.json",
    },
  });
app.use(express.json());
app.use(auth());
app.use(middleware.handle(i18Next));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(`${api}/test`, testRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/users`, resetPassword);
app.use(`${api}/users`, updateProfile);
app.use(`${api}/catgs`, catgsRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/shiping`, shipingRouter);
app.use(`${api}/payment`, paymentRouter);
app.use(`${api}/address`, addressRouter);

mongoose
  .connect(process.env.CONNECT_STRING)
  .then(() => console.log("Connected"))
  .catch((err) => {
    console.log(err);
  });

// Development
// app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Production
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Express is working on port" + port);
});
