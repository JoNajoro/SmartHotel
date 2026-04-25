it('should return 500 on internal error', async () => {
  const token = await getToken();
  const smarthotel = require('../smarthotel');
  const original = smarthotel.calculatePrice;
  
  // Patch direct sur l'objet module
  Object.defineProperty(smarthotel, 'calculatePrice', {
    value: () => { throw new Error('Unexpected error'); },
    writable: true,
    configurable: true,
  });

  const res = await request(app)
    .post('/api/book-room')
    .set('Authorization', `Bearer ${token}`)
    .send(validBody);

  // Restaure
  Object.defineProperty(smarthotel, 'calculatePrice', {
    value: original,
    writable: true,
    configurable: true,
  });

  expect(res.status).toBe(500);
  expect(res.body.error).toBe('Internal server error');
});