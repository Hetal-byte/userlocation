# User Location Tracker

A web application that tracks user location, displays it on Google Maps, and shows current weather conditions for the location.

## Features

- **User Profile Page**: Clean interface with "Obtain Location" button
- **Location Tracking**: Get user's current location using browser geolocation
- **Reverse Geocoding**: Convert coordinates to human-readable format (City, State, Country)
- **Google Maps Integration**: Interactive map with location marker
- **Weather Information**: Current weather conditions for the displayed location
- **Interactive Map**: Click anywhere on the map to update location and weather

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get API Keys

You'll need to obtain the following API keys:

#### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Maps JavaScript API
4. Create credentials (API Key)
5. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `public/app.js`

#### OpenWeatherMap API Key
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key
4. Replace `YOUR_WEATHER_API_KEY` in `public/app.js`

#### OpenCage API Key (for Reverse Geocoding)
1. Go to [OpenCage](https://opencagedata.com/)
2. Sign up for a free account
3. Get your API key
4. Replace `YOUR_OPENCAGE_API_KEY` in `public/app.js`

### 3. Update API Keys

Edit `public/app.js` and replace the placeholder API keys:

```javascript
const GOOGLE_MAPS_API_KEY = 'your_google_maps_api_key_here';
const WEATHER_API_KEY = 'your_openweathermap_api_key_here';
const REVERSE_GEOCODING_API_KEY = 'your_opencage_api_key_here';
```

### 4. Start the Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Open the application in your browser
2. Click the "Obtain Location" button to get your current location
3. Your location will be displayed in the format: "City, State, Country"
4. A Google Map will show your location with a marker
5. Current weather information will be displayed
6. Click anywhere on the map to move the marker and update the weather for that location

## File Structure

```
userlocation/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styling
│   ├── app.js          # JavaScript functionality
│   └── server.js       # Express server
├── package.json        # Project dependencies
└── README.md          # This file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **APIs**: Google Maps JavaScript API, OpenWeatherMap API, OpenCage Geocoding API
- **Styling**: Custom CSS with modern design

## Browser Compatibility

This application requires a modern browser with support for:
- Geolocation API
- Fetch API
- ES6+ JavaScript features

## Notes

- The application requires HTTPS in production for geolocation to work
- Make sure to enable location services in your browser
- API keys have usage limits, check the respective service documentation 