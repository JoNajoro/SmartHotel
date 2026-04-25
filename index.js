const express = require('express');
const path = require('path');
const { calculatePrice } = require('./smarthotel');
const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('GET / called');
  res.send('<h1>SmartHotel Interface</h1><p>Interface en développement...</p>');
});

app.post('/api/book-room', (req, res) => {
  try {
    const { basePrice, nights, guests, season, hasWeekend, seaView, clientType } = req.body;

    // Validation des entrées
    if (typeof basePrice !== 'number' || basePrice <= 0) {
      return res.status(400).json({ success: false, error: 'basePrice must be a positive number' });
    }
    if (typeof nights !== 'number' || nights <= 0 || !Number.isInteger(nights)) {
      return res.status(400).json({ success: false, error: 'nights must be a positive integer' });
    }
    if (typeof guests !== 'number' || guests <= 0 || !Number.isInteger(guests)) {
      return res.status(400).json({ success: false, error: 'guests must be a positive integer' });
    }
  
    if (typeof season !== 'string' || !['Haute', 'Basse'].includes(season)) {
      return res.status(400).json({ success: false, error: 'season must be "Haute" or "Basse"' });
    }
  
    if (typeof hasWeekend !== 'boolean') {
      return res.status(400).json({ success: false, error: 'hasWeekend must be a boolean' });
    }
    
    if (typeof seaView !== 'boolean') {
      return res.status(400).json({ success: false, error: 'seaView must be a boolean' });
    }
    if (typeof clientType !== 'string' || !['VIP', 'Standard'].includes(clientType)) {
      return res.status(400).json({ success: false, error: 'clientType must be "VIP" or "Standard"' });
    }
    const result = calculatePrice(basePrice, nights, guests, season, hasWeekend, seaView, clientType);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.listen(3000, () => console.log('SmartHotel API running on http://localhost:3000'));