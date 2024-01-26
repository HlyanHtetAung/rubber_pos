const express = require("express");
const addressController = require("../controller/address");

const router = express.Router();

router.get("/", addressController.getAddress);

router.post("/", addressController.postAddress);

router.put("/", addressController.updateAddress);

router.delete("/", addressController.deleteAddress);

module.exports = router;
