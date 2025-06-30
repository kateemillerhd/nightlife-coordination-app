require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const User = require("./models/User");

const apiKey = process.env.YELP_API_KEY;
const mongoUri = process.env.MONGO_URI;
const sessionSecret = process.env.SESSION_SECRET;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("client"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Nightlife Coordination App is running");
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  req.session.username = username;
  res.json({ message: "Logged in", user: username });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    req.session.username = username;
    res.json({ message: "Registered and logged in", user: username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ error: "Invalid username or password" });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(400).json({ error: "Inmvalid username or password" });

    req.session.username = username;
    res.json({ message: "Logged in", user: username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.use("/api", require("./routes/api"));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});
