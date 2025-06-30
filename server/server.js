require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

const apiKey = process.env.YELP_API_KEY;
const mongoUri = process.env.MONGO_URI;
const sessionSecret = process.env.SESSION_SECRET;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() = console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', (req, res) => {
  res.send('Nightlife Coordination App is running');
});

app.use('/api', require('./routes/api'));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});