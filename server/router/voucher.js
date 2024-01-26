const express = require("express");
const voucherController = require("../controller/voucher");

const router = express.Router();

router.post("/", voucherController.postVoucher);

router.get("/", voucherController.getVoucher);

module.exports = router;
