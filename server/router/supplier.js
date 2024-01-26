const express = require("express");
const supplierController = require("../controller/supplier");

const router = express.Router();

router.get("/", supplierController.getSupplier);

router.post("/", supplierController.postSupplier);

router.put("/", supplierController.updateSupplier);

module.exports = router;
