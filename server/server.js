require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

const apiKey = process.env.YELP_API_KEY;
const mongoUri = process.env.MONGO_URI;
const sessionSecret = process.env.SESSION_SECRET;

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