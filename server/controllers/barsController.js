const axios = require('axios');

const searchBars = async (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.status(400).json({ error: 'Missing location parameter' });
  }

  try {
    const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`
      },
      params: {
        term: 'bars',
        location: location,
        limit: 10,
        sort_by: 'rating'
      }
    });

    const results = response.data.businesses.map(business => ({
      id: business.id,
      name: business.name,
      image_url: business.image_url,
      url: business.url,
      rating: business.rating,
      review_count: business.review_count,
      location: business.location.display_address.join(', '),
    }));

    res.json(results);
  } catch (err) {
    console.error('Yelp API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch data from Yelp' });
  }
};

module.exports = {
  searchBars
};