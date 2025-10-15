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
      ref: "User", // matches your User model
      required: true,
    },
    scannedAt: {
      type: Date,
      default: Date.now, // auto-set time of scanning
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// ✅ Export the model directly
module.exports = mongoose.model("TicketScan", ticketScanSchema);
