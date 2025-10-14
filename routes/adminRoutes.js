const express = require("express");
const { authentication, authorization } = require("../middlewares/authmiddlewares.js");
const { getAllUsers, deleteUser, getAllEventsAdmin, deleteEventAdmin  } = require("../controllers/adminController.js");


const router = express.Router();

// All routes protected for Admin only
router.use(authentication, authorization("admin"));

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Events
router.get("/events", getAllEventsAdmin);
router.delete("/events/:id", deleteEventAdmin);

module.exports = router;
