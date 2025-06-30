const express = require('express');
const router = express.Router();
const { searchBars, toggleAttendance } = require('../controllers/barsController');

router.get('/search', searchBars);

router.post('/bars/:yelpId/attend', toggleAttendance);

module.exports = router;