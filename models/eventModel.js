const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dateTime: { type: Date, required: true },
    venue: { type: String, required: true },
    ticketLimit: { type: Number, default: 100 },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
