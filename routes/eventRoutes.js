const express = require("express");
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require("../controllers/eventController.js");
const { authentication,authorization}=require("../middlewares/authmiddlewares.js");


const router = express.Router();

// Public: Get all events
router.get("/", authentication, getAllEvents);

// Public: Get single event
router.get("/:id", authentication, getEventById);

// Host/Admin only
router.post("/", authentication, authorization("host", "admin"), createEvent);
router.put("/:id", authentication, authorization("host", "admin"), updateEvent);
router.delete("/:id", authentication, authorization("host", "admin"), deleteEvent);

module.exports = router;
