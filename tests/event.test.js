
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("../config/db.js");
const eventRoutes = require("../routes/eventRoutes.js");
const authRoutes = require("../routes/authRoutes.js");  

const app = express();
app.use(express.json());
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

let token = ""; // JWT token for auth
let eventId = ""; // Store created event ID

beforeAll(async () => {
  await connectDB(); // Connect to test DB

  // Create a test user and get token
  const email = `testuser${Date.now()}@example.com`;
  const password = "123456";

  await request(app)
    .post("/api/auth/signup")
    .send({ name: "Test User", email, password });

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase(); // Cleanup
  await mongoose.disconnect();
});

describe("Event API Tests", () => {
  it("should create a new event", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Event",
        description: "This is a test event",
        dateTime: new Date(),
        venue: "Test Venue",
        ticketLimit: 50,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Event");
    eventId = res.body._id;
  });

  it("should fetch all events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should fetch event by ID", async () => {
    const res = await request(app).get(`/api/events/${eventId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(eventId);
  });

  it("should update an event", async () => {
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Test Event" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Test Event");
  });

  it("should delete an event", async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Event deleted successfully");
  });
});

