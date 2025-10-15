const express = require("express");
const { scanTicket } = require("../controllers/scanController.js");
const { authentication, authorization } = require("../middlewares/authmiddlewares.js");


const router = express.Router();

// Scan QR code (host/admin)
router.post("/", authentication, authorization("host","admin","user"), scanTicket);

module.exports = router;
