const express = require("express");
const { body, validationResult } = require("express-validator");
const { purchaseTicket, getMyTickets } = require("../controllers/ticketController.js");
const { authentication, authorization } = require("../middlewares/authmiddlewares.js");

const router = express.Router();

// Validation middleware for purchase
const purchaseValidation = [
  body("eventId").notEmpty().withMessage("Event ID is required"),
];

// Purchase ticket (user)
router.post(
  "/",
  authentication,
  authorization("user"),
  purchaseValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  purchaseTicket
);

// Get logged-in user's tickets
router.get("/mytickets", authentication, authorization("user","admin","host"), getMyTickets);

module.exports = router;
