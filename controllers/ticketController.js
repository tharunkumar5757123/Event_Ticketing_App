const QRCode = require("qrcode");
const Ticket = require("../models/ticketModel.js");
const Event = require("../models/eventModel.js");
const { sendTicketEmail } = require("./eamilController.js");

// Purchase ticket
const purchaseTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;
    const userEmail = req.user.email;

    // 1️⃣ Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2️⃣ Generate QR code for ticket
    const qrCodeData = await QRCode.toDataURL(`${userId}_${eventId}_${Date.now()}`);

    // 3️⃣ Create ticket
    let ticket = await Ticket.create({
      event: event._id,
      user: userId,
      qrCodeData,
      isScanned: false,
    });

    // 4️⃣ Populate event so email can show details
    ticket = await ticket.populate("event");

    // 5️⃣ Send ticket email
    await sendTicketEmail(userEmail, ticket);

    // 6️⃣ Respond
    res.status(200).json({ message: "Ticket purchased successfully", ticket });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


const getMyTickets = async (req, res) => {
  try {
    console.log("🔍 Incoming request from user:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found in request" });
    }

    const userId = req.user._id;
    const tickets = await Ticket.find({ user: userId }).populate("event");

    console.log("✅ Tickets found:", tickets.length);
    res.status(200).json({ tickets });
  } catch (error) {
    console.error("❌ getMyTickets error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports={purchaseTicket,getMyTickets}