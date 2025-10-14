const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // should match the Event model name
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // should match your User model name
      required: true,
    },
    qrCodeData: {
      type: String,
      required: true,
    },
    isScanned: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = { Ticket };
