const {Event} = require("../models/eventModel.js");

// ✅ Create Event (Host/Admin only)
const createEvent = async (req, res) => {
  try {
    const { title, description, dateTime, venue, ticketLimit } = req.body;

    const event = await Event.create({
      title,
      description,
      dateTime,
      venue,
      ticketLimit,
      host: req.user._id
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("host", "name email role");
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single Event
 const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("host", "name email role");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Event (Host/Admin only)
 const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only host or admin can update
    if (event.host.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Event (Host/Admin only)
 const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.host.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await event.remove();
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
