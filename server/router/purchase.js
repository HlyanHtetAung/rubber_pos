const express = require("express");
const purchaseController = require("../controller/purchase");

const router = express.Router();

router.get("/", purchaseController.getPurchase);

router.post("/", purchaseController.postPurchase);

router.put("/", purchaseController.updatePurchase);

router.delete("/", purchaseController.deletePurchase);

router.delete("/id/:id", purchaseController.deletePurchaseById);

module.exports = router;
