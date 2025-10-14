const mongoose = require("mongoose");

const ticketScanSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket", // refers to the Ticket model
      required: true,
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Host" if you have a separate Host model
      required: true,
    },
    scannedAt: {
      type: Date,
      default: Date.now, // auto-set time of scanning
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  }
);

const TicketScanModel = mongoose.model("TicketScan", ticketScanSchema);

module.exports = { TicketScanModel };
