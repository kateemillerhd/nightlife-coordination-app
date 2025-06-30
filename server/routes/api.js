const express = require('express');
const router = express.Router();
const { searchBars, toggleAttendance } = require('../controllers/barsController');
const User = require('../models/User');

router.get('/search', async (req, res) => {
  const location = req.query.location;
  try {
    const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: { Authorization: `Bearer ${process.env.YELP_API_KEY}` },
      params: {
        location,
        categories: 'bars',
        limit: 10
      }
    });

    const businesses = response.data.businesses;

    const barsWithCounts = await Promise.all(
      businessses.map(async (bar) => {
        const count = await User.countDocuments({ attending: bar.id });
        return {
          id: bar.id,
          name: bar.name,
          location: bar.location.city,
          url: bar.url,
          image_url: bar.image_url,
          attendees: count
        };
      })
    );

    res.json(barsWithCounts);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yelp search failed' });
  }
});

router.post('/bars/:yelpId/attend', toggleAttendance);
const attendees = await User.countDocuments({ attending: yelpId });
res.json({ message, attendees });

module.exports = router;