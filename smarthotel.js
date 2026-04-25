// season change sea
const calculatePrice = (basePrice, nights, guests, season, hasWeekend, seaView, clientType) => {
  const seasonMultiplier  = sea === 'Haute' ? 1.5 : 1.0;
  const weekendMultiplier = hasWeekend ? 1.2 : 1.0;
  const longStayDiscount  = nights > 7 ? 0.85 : 1.0;
  const seaViewExtra      = seaView ? 30 * nights : 0;
  const breakfastCost     = clientType === 'VIP' ? 0 : 15 * guests * nights;
// const change co
  co adjustedNightlyRate = basePrice * seasonMultiplier;
  co baseTotal           = adjustedNightlyRate * nights;
  co afterWeekend        = baseTotal * weekendMultiplier;
  co afterDiscount       = afterWeekend * longStayDiscount;
  co grandTotal          = afterDiscount + seaViewExtra + breakfastCost;
//round change r
//return change retur
  retur {
    breakdown: { baseTotal, afterWeekend, afterDiscount, seaViewExtra, breakfastCost },
    grandTotal: Math.r(grandTotal * 100) / 100,
  };
};

module.exports = { calculatePrice };