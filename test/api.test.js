const request = require("supertest");
const app = require("../index");

describe("SmartHotel API Authentication", () => {
  test("POST /api/login should authenticate valid user", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({
        username: "admin",
        password: "password123"
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.username).toBe("admin");
  });

  test("POST /api/login should reject invalid credentials", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({
        username: "admin",
        password: "wrongpassword"
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Invalid credentials");
  });

  test("POST /api/login should require username and password", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe("SmartHotel API Protected Endpoints", () => {
  let validToken;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/api/login")
      .send({
        username: "user",
        password: "password456"
      });
    validToken = loginResponse.body.token;
  });

  test("POST /api/book-room should require authentication token", async () => {
    const response = await request(app)
      .post("/api/book-room")
      .send({
        basePrice: 100,
        nights: 2,
        guests: 2,
        season: "Basse",
        hasWeekend: false,
        seaView: false,
        clientType: "Standard"
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("No token provided");
  });

  test("POST /api/book-room should reject invalid token", async () => {
    const response = await request(app)
      .post("/api/book-room")
      .set("Authorization", "Bearer invalid-token")
      .send({
        basePrice: 100,
        nights: 2,
        guests: 2,
        season: "Basse",
        hasWeekend: false,
        seaView: false,
        clientType: "Standard"
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Invalid or expired token");
  });

  test("POST /api/book-room should calculate price with valid token", async () => {
    const response = await request(app)
      .post("/api/book-room")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        basePrice: 100,
        nights: 2,
        guests: 2,
        season: "Basse",
        hasWeekend: false,
        seaView: false,
        clientType: "Standard"
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.grandTotal).toBe(260);
    expect(response.body.breakdown.baseTotal).toBe(200);
    expect(response.body.breakdown.breakfastCost).toBe(60);
  });

  test("POST /api/book-room should work with VIP client and valid token", async () => {
    const response = await request(app)
      .post("/api/book-room")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        basePrice: 100,
        nights: 3,
        guests: 2,
        season: "Haute",
        hasWeekend: true,
        seaView: true,
        clientType: "VIP"
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.grandTotal).toBe(630);
    expect(response.body.breakdown.breakfastCost).toBe(0);
  });

  test("POST /api/book-room should reject invalid input even with valid token", async () => {
    const response = await request(app)
      .post("/api/book-room")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        basePrice: -50,
        nights: 1,
        guests: 1,
        season: "Basse",
        hasWeekend: false,
        seaView: false,
        clientType: "Standard"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("basePrice");
  });
});
