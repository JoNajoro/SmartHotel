const { calculatePrice } = require('../smarthotel');

describe('calculatePrice', () => {
  test('should calculate price with base case', () => {
    const result = calculatePrice(100, 1, 1, 'Basse', false, false, 'Standard');
    expect(result.grandTotal).toBe(115); // 100 + 15 breakfast
    expect(result.breakdown.baseTotal).toBe(100);
    expect(result.breakdown.afterWeekend).toBe(100);
    expect(result.breakdown.afterDiscount).toBe(100);
    expect(result.breakdown.seaViewExtra).toBe(0);
    expect(result.breakdown.breakfastCost).toBe(15);
  });

  test('should apply season multiplier for Haute season', () => {
    const result = calculatePrice(100, 1, 1, 'Haute', false, false, 'Standard');
    expect(result.grandTotal).toBe(165); // 150 + 15 breakfast
    expect(result.breakdown.baseTotal).toBe(150);
    expect(result.breakdown.afterWeekend).toBe(150);
    expect(result.breakdown.afterDiscount).toBe(150);
  });

  test('should apply weekend multiplier', () => {
    const result = calculatePrice(100, 1, 1, 'Basse', true, false, 'Standard');
    expect(result.grandTotal).toBe(135); // 120 + 15 breakfast
    expect(result.breakdown.afterWeekend).toBe(120);
    expect(result.breakdown.afterDiscount).toBe(120);
  });

  test('should apply long stay discount for nights > 7', () => {
    const result = calculatePrice(100, 8, 1, 'Basse', false, false, 'Standard');
    // baseTotal: 100 * 8 = 800
    // afterWeekend: 800 (no weekend)
    // afterDiscount: 800 * 0.85 = 680
    // seaViewExtra: 0
    // breakfastCost: 15 * 1 * 8 = 120
    // grandTotal: 680 + 0 + 120 = 800
    expect(result.breakdown.baseTotal).toBe(800);
    expect(result.breakdown.afterDiscount).toBe(680);
    expect(result.grandTotal).toBe(800);
  });

  test('should add sea view extra', () => {
    const result = calculatePrice(100, 2, 1, 'Basse', false, true, 'Standard');
    expect(result.breakdown.seaViewExtra).toBe(60); // 30 * 2 nights
    expect(result.breakdown.breakfastCost).toBe(30); // 15 * 1 * 2
    expect(result.grandTotal).toBe(290); // 200 + 0 + 60 + 30
  });

  test('should waive breakfast for VIP clients', () => {
    const result = calculatePrice(100, 1, 1, 'Basse', false, false, 'VIP');
    expect(result.breakdown.breakfastCost).toBe(0);
    expect(result.grandTotal).toBe(100);
  });

  test('should apply all modifiers correctly', () => {
    const result = calculatePrice(200, 10, 2, 'Haute', true, true, 'Standard');
    // Season: 200 * 1.5 = 300 per night
    // baseTotal: 300 * 10 = 3000
    // afterWeekend: 3000 * 1.2 = 3600
    // afterDiscount: 3600 * 0.85 = 3060
    // seaViewExtra: 30 * 10 = 300
    // breakfastCost: 15 * 2 * 10 = 300
    // grandTotal: 3060 + 300 + 300 = 3660
    expect(result.breakdown.baseTotal).toBe(3000);
    expect(result.breakdown.afterWeekend).toBe(3600);
    expect(result.breakdown.afterDiscount).toBe(3060);
    expect(result.breakdown.seaViewExtra).toBe(300);
    expect(result.breakdown.breakfastCost).toBe(300);
    expect(result.grandTotal).toBe(3660);
  });
});
