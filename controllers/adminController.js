const User = require("../models/userModel.js");
const Event = require("../models/eventModel.js");
// ✅ Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v -createdAt -updatedAt");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all events (admin can see all events)
const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find().populate("host", "name email role");
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete any event
 const deleteEventAdmin = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.remove();
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllUsers,
  deleteUser,
  getAllEventsAdmin,
  deleteEventAdmin
};