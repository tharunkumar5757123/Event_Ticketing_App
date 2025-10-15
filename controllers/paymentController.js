const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Ticket = require("../models/ticketModel.js");
const Event = require("../models/eventModel.js");
const { sendTicketEmail } = require("./eamilController.js");
const QRCode = require("qrcode");

// Create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Amount in cents
    const amount = event.price * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { eventId, userId: req.user._id.toString() },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Handle successful payment (webhook or manual confirmation)
const handlePaymentSuccess = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(`${userId}_${eventId}_${Date.now()}`);

    // Create ticket
    const ticket = await Ticket.create({
      event: eventId,
      user: userId,
      qrCodeData,
      isScanned: false,
    });

    // Send email
    const userEmail = req.user.email;
    await sendTicketEmail(userEmail, ticket);

    res.status(200).json({ message: "Payment confirmed, ticket sent!", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent, handlePaymentSuccess };
