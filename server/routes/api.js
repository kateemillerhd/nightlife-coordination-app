const express = require('express');
const router = express.Router();
const barsController = require('../controllers/barsController');
const User = require('../models/User');
const axios = require('axios');

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
      businesses.map(async (bar) => {
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

router.post('/bars/:yelpId/attend', async (req, res) => {
  const yelpId = req.params.yelpId;
  const user = await User.findOne({ username: req.session.username });

  if (!user) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  const alreadyGoing = user.attending.includes(yelpId);

  let message;
  if (alreadyGoing) {
    user.attending = user.attending.filter(id => id !== yelpId);
    await user.save();
    let message = 'You are no longer attending';
  } else {
    user.attending.push(yelpId);
    await user.save();
    let message = 'You are now attending';
  }
  
const attendees = await User.countDocuments({ attending: yelpId });
res.json({ message, attendees });
});
  
module.exports = router;