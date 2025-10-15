const Ticket = require("../models/ticketModel.js");
const TicketScan = require("../models/scanLogModel.js");
const { io } = require("../server.js");

const scanTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;
    const userId = req.user._id; // host scanning the ticket

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.isScanned) return res.status(400).json({ message: "Ticket already scanned" });

    // Mark ticket as scanned
    ticket.isScanned = true;
    await ticket.save();

    // Log the scan
    await TicketScan.create({
      ticket: ticket._id,
      scannedBy: userId,
      scannedAt: new Date(),
    });

    // Emit live update to frontend
    io.emit("ticketScanned", {
      ticketId: ticket._id,
      eventId: ticket.event,
      scannedBy: userId,
    });

    res.status(200).json({ message: "Ticket scanned successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { scanTicket };
