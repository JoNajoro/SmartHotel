const request = require("supertest");
const app = require("../index");

describe("SmartHotel API", () => {
  test("GET / should return welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("SmartHotel");
  });

  test("POST /api/book-room should calculate price with valid data", async () => {
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

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // baseTotal: 200, breakfast: 60, grandTotal: 260
    expect(response.body.grandTotal).toBe(260);
    expect(response.body.breakdown.baseTotal).toBe(200);
    expect(response.body.breakdown.breakfastCost).toBe(60);
  });

  test("should reject invalid basePrice", async () => {
    const response = await request(app)
      .post("/api/book-room")
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

  test("should reject non-integer nights", async () => {
    const response = await request(app)
      .post("/api/book-room")
      .send({
        basePrice: 100,
        nights: 1.5,
        guests: 1,
        season: "Basse",
        hasWeekend: false,
        seaView: false,
        clientType: "Standard"
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("nights");
  });

  test("should validate season value", async () => {
    const response = await request(app)
      .post("/api/book-room")
      .send({
        basePrice: 100,
        nights: 1,
        guests: 1,
        season: "Invalid",
        hasWeekend: false,
        seaView: false,
        clientType: "Standard"
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("season");
  });

  test("should validate clientType value", async () => {
    const response = await request(app)
      .post("/api/book-room")
      .send({
        basePrice: 100,
        nights: 1,
        guests: 1,
        season: "Basse",
        hasWeekend: false,
        seaView: false,
        clientType: "Bronze"
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("clientType");
  });

  test("should handle missing required fields", async () => {
    const response = await request(app)
      .post("/api/book-room")
      .send({
        basePrice: 100
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("should calculate price with VIP client (free breakfast)", async () => {
    const response = await request(app)
      .post("/api/book-room")
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
    // baseTotal: 100 * 1.5 * 3 = 450
    // afterWeekend: 450 * 1.2 = 540
    // afterDiscount: 540 * 1.0 = 540 (3 nights <= 7)
    // seaViewExtra: 30 * 3 = 90
    // breakfast: 0
    // total: 540 + 90 = 630
    expect(response.body.grandTotal).toBe(630);
    expect(response.body.breakdown.breakfastCost).toBe(0);
  });
});
