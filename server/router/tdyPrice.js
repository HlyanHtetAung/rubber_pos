const express = require("express");
const tdyPriceController = require("../controller/tdyPrice");

const router = express.Router();

router.get("/", tdyPriceController.getTdyPrice);

router.post("/", tdyPriceController.postTdyPrice);

module.exports = router;
