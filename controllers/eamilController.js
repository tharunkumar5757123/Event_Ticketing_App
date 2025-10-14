const nodemailer = require("nodemailer");

const sendTicketEmail = async (userEmail, ticket) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Your Eventify Ticket",
    html: `<h3>Ticket Purchased Successfully!</h3>
           <p>Event: ${ticket.event}</p>
           <img src="${ticket.qrCodeData}" alt="QR Code"/>`,
  };

  await transporter.sendMail(mailOptions);
};
module.exports = { sendTicketEmail };
