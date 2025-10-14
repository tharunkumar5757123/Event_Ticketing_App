const QRCode = require("qrcode");
const Ticket = require("../models/ticketModel.js");
const Event = require("../models/eventModel.js");
const { sendTicketEmail } = require("./eamilController.js"); // fixed filename

// Purchase ticket
const purchaseTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;

    // 1️⃣ Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2️⃣ Generate QR code for ticket
    const qrCodeData = await QRCode.toDataURL(`${userId}_${eventId}_${Date.now()}`);

    // 3️⃣ Create ticket
    const ticket = await Ticket.create({
      event: event._id,
      user: userId,
      qrCodeData,
      isScanned: false,
    });

    // 4️⃣ Send ticket email
    await sendTicketEmail(req.user.email, ticket);

    // 5️⃣ Respond
    res.status(200).json({ message: "Ticket purchased successfully", ticket });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in user's tickets
const getMyTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    const tickets = await Ticket.find({ user: userId }).populate("event");
    res.status(200).json({ tickets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { purchaseTicket, getMyTickets };
