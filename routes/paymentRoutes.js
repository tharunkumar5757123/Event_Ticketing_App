const express = require("express");
const { createPaymentIntent } = require("../controllers/paymentController.js");
const { authentication, authorization } = require("../middlewares/authmiddlewares.js");

const router = express.Router();

router.post("/create-payment-intent", authentication, authorization("user"), createPaymentIntent);

module.exports = router;
