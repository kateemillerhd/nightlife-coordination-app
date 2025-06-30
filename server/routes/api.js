const express = require('express');
const router = express.Router();
const { searchBars } = require('../controllers/barsController');

router.get('/search', searchBars);


module.exports = router;