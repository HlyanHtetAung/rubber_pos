const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const purchaseRoute = require("./router/purchase");
const tdyPriceRoute = require("./router/tdyPrice");
const addressRoute = require("./router/address");
const supplierRoute = require("./router/supplier");
const voucherRoute = require("./router/voucher");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.static(path.join(__dirname, "../")));

app.use("/purchase", purchaseRoute);
app.use("/price", tdyPriceRoute);
app.use("/address", addressRoute);
app.use("/supplier", supplierRoute);
app.use("/voucher", voucherRoute);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(3001);
