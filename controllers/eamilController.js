const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Send ticket email to the user.
 * @param {string} userEmail - The recipient's email
 * @param {Object} ticket - Ticket object (must have populated event)
 */
const sendTicketEmail = async (userEmail, ticket) => {
  // Ensure event is populated
  const event = ticket.event;
  if (!event) {
    console.error("❌ Ticket event not populated");
    return;
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_USER or EMAIL_PASS missing in .env");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  const mailOptions = {
    from: `"Eventify 🎫" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Your Ticket for ${event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; text-align:center; padding:20px; border:1px solid #ddd; border-radius:10px;">
        <h2 style="color:#2E86C1;">🎫 Ticket Purchased Successfully!</h2>
        <p><strong>Event:</strong> ${event.title}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <p><strong>Date & Time:</strong> ${new Date(event.dateTime).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
        <img src="${ticket.qrCodeData}" alt="QR Code" style="width:300px; height:300px; margin-top:20px;"/>
        <p style="margin-top:20px; font-size:14px; color:#555;">Show this QR code at the event entrance.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};

module.exports = { sendTicketEmail };
