const express = require("express");
const router = express.Router();
const { authentication, authorization } = require("../middlewares/authmiddlewares.js");
const { createPaymentIntent, handlePaymentSuccess } = require("../controllers/paymentController.js");

// Create payment intent (for frontend Stripe)
router.post("/create", authentication, authorization("user"), createPaymentIntent);

// Confirm payment & issue ticket
router.post("/confirm", authentication, authorization("user"), handlePaymentSuccess);

module.exports = router;
