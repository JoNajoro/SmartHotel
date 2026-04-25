const calculatePrice = (options) => {
  const { basePrice, nights, guests, season, hasWeekend, seaView, clientType } = options;

  const seasonMultiplier = { Haute: 1.5, Basse: 1.0 }[season];
  const weekendMultiplier = { true: 1.2, false: 1.0 }[hasWeekend];
  const longStayDiscount = 1 - 0.15 * (nights > 7);
  const seaViewExtra = seaView * 30 * nights;
  const breakfastCost = (clientType !== "VIP") * 15 * guests * nights;
  const adjustedNightlyRate = basePrice * seasonMultiplier;
  const baseTotal = adjustedNightlyRate * nights;
  const afterWeekend = baseTotal * weekendMultiplier;
  const afterDiscount = afterWeekend * longStayDiscount;
  const grandTotal = afterDiscount + seaViewExtra + breakfastCost;

  return {
    breakdown: { baseTotal, afterWeekend, afterDiscount, seaViewExtra, breakfastCost },
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
};

module.exports = { calculatePrice };
