const express = require("express");
const { getHostStats, getAdminStats } = require("../controllers/statsController.js");
const { authentication, authorization } = require("../middlewares/authmiddlewares.js");

const router = express.Router();

// Host stats: their events, ticket sales, check-ins
router.get("/host", authentication, authorization("host"), getHostStats);

// Admin stats: platform-wide metrics
router.get("/admin", authentication, authorization("admin"), getAdminStats);

module.exports = router;
