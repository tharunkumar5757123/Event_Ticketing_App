const {Event} = require("../models/eventModel.js");
const {Ticket} = require("../models/ticketModel.js");
const {ScanLog}= require("../models/scanLogModel.js");
const {User} = require("../models/userModel.js");

// ✅ Get stats for a specific host (their events)
const getHostStats = async (req, res) => {
  try {
    const hostId = req.user._id;

    // Fetch all events created by this host
    const events = await Event.find({ host: hostId });

    // Prepare stats per event
    const stats = await Promise.all(
      events.map(async (event) => {
        const totalTickets = await Ticket.countDocuments({ event: event._id });
        const checkedInTickets = await Ticket.countDocuments({
          event: event._id,
          isScanned: true,
        });

        const scanLogs = await ScanLog.find({ ticket: { $in: (await Ticket.find({ event: event._id })).map(t => t._id) } }).populate("scannedBy", "name email");

        return {
          eventId: event._id,
          title: event.title,
          totalTickets,
          checkedInTickets,
          scanLogs,
        };
      })
    );

    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get platform-wide stats (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const totalCheckedIn = await Ticket.countDocuments({ isScanned: true });
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalEvents,
      totalTickets,
      totalCheckedIn,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHostStats, getAdminStats };
