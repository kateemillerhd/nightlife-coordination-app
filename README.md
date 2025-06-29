# nightlife-coordination-app

A full-stack JavaScript app where users can search for bars in a city, see who's
going, and indicate their own attendance. Built with Node.js, Express, and Yelp API.

## Features

- View bars in any city (powered by [Yelp Fusion API](https://www.yelp.com/developers/documentation/v3))
- User authentication (add/remove yourself from bars)
- Attendance tracking per bar
- Preserves city search after login

## Tech Stack

- Frontend: HTML/CSS/JavaScript
- Backend: Node.js, Express
- Auth: Passport.js
- Database: MongoDB
- API: Yelp Fusion API
- Hosting: Replit

## Environment Variables

Create a `.env` file with the following:

```env
YELP_API_KEY=your_yelp_api_key
MONGO_URI=your_mongo_connection_string
SESSION_SECRET=your_secret_here
