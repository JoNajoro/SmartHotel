
const calculatePrice = (basePrice, nights, guests, season, hasWeekend, seaView, clientType) => {
  const seasonMultiplier  = season === 'Haute' ? 1.5 : 1.0;
  const weekendMultiplier = hasWeekend ? 1.2 : 1.0;
  const longStayDiscount  = nights > 7 ? 0.85 : 1.0;
  const seaViewExtra      = seaView ? 30 * nights : 0;
  const breakfastCost     = clientType === 'VIP' ? 0 : 15 * guests * nights;
  const adjustedNightlyRate = basePrice * seasonMultiplier;
  const baseTotal           = adjustedNightlyRate * nights;
  const afterWeekend        = baseTotal * weekendMultiplier;
  const afterDiscount       = afterWeekend * longStayDiscount;
  const grandTotal          = afterDiscount + seaViewExtra + breakfastCost;
  return {
    breakdown: { baseTotal, afterWeekend, afterDiscount, seaViewExtra, breakfastCost },
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
};

module.exports = { calculatePrice };