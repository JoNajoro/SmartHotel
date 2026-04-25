const express = require("express");
const { calculatePrice } = require("./smarthotel");
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("GET / called");
  res.send("<h1>SmartHotel Interface</h1><p>Interface en développement...</p>");
});

const validateNumber = (value, fieldName) => {
  if (typeof value !== "number" || value <= 0) {
    return `${fieldName} must be a positive number`;
  }
  if (!Number.isInteger(value)) {
    return `${fieldName} must be an integer`;
  }
  return null;
};

const validateSeason = (season) => {
  if (typeof season !== "string" || !["Haute", "Basse"].includes(season)) {
    return "season must be 'Haute' or 'Basse'";
  }
  return null;
};

const validateClientType = (clientType) => {
  if (typeof clientType !== "string" || !["VIP", "Standard"].includes(clientType)) {
    return "clientType must be 'VIP' or 'Standard'";
  }
  return null;
};

const validateBoolean = (value, fieldName) => {
  if (typeof value !== "boolean") {
    return `${fieldName} must be a boolean`;
  }
  return null;
};

const validateBookingInput = (body) => {
  const validations = [
    () => validateNumber(body.basePrice, "basePrice"),
    () => validateNumber(body.nights, "nights"),
    () => validateNumber(body.guests, "guests"),
    () => validateSeason(body.season),
    () => validateBoolean(body.hasWeekend, "hasWeekend"),
    () => validateBoolean(body.seaView, "seaView"),
    () => validateClientType(body.clientType)
  ];

  const errors = [];
  for (const validate of validations) {
    const error = validate();
    if (error) errors.push(error);
  }
  return errors;
};

app.post("/api/book-room", (req, res) => {
  try {
    const errors = validateBookingInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join("; ") });
    }

    const { basePrice, nights, guests, season, hasWeekend, seaView, clientType } = req.body;
    const result = calculatePrice({ basePrice, nights, guests, season, hasWeekend, seaView, clientType });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Export app for testing
module.exports = app;

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(3000, () => console.log("SmartHotel API running on http://localhost:3000"));
}
