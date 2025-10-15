const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // matches Event model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // matches User model
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
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// ✅ Export the model directly
module.exports = mongoose.model("Ticket", ticketSchema);
