const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/authRoutes.js");
const { connectDB } = require("../config/db.js");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

beforeAll(async () => {
  await connectDB(); // Connect to test DB
});

describe("Auth API Tests", () => {
  let testEmail = `test${Date.now()}@example.com`;

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: testEmail,
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Registered successfully");
    expect(res.body.data[0].email).toBe(testEmail);
  });

  it("should not allow duplicate registration", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: testEmail,
        password: "123456",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("email already exist");
  });

  it("should login successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successfully");
    expect(res.body.token).toBeDefined();
  });
});
