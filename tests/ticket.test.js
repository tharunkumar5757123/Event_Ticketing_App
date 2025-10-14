

const request = require("supertest");
const express = require("express");
const ticketRoutes = require("../routes/ticketRoutes.js");
const { connectDB } = require("../config/db.js");



const app = express();
app.use(express.json());
app.use("/api/tickets", ticketRoutes);

beforeAll(async () => {
  await connectDB(); // Connect to test DB
});

describe("Ticket API Tests", () => {
  let token = ""; // use a valid JWT from a test user
  let eventId = "64f1a0b0b5b1f123456789ab"; // replace with a real event ID in test DB

  it("should purchase a ticket", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({ eventId });

    expect(res.statusCode).toBe(200);
    expect(res.body.ticket).toBeDefined();
  });
});
