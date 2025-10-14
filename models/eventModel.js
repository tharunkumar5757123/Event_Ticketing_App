const mongoose = require("mongoose");
const { create } = require("qrcode");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    dateTime: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    ticketLimit: {
      type: Number,
      default: 100, // optional default
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // model name of your user
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = { Event };
