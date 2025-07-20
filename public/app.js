// Configuration
const GOOGLE_MAPS_API_KEY = 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao'; 
const WEATHER_API_KEY = '8ea0e63b9fabf18cdc828fb55cb49fe8'; 
const REVERSE_GEOCODING_API_KEY = 'c4e8f3e2f8434f8687886b5ef023f59e'; 

// DOM Elements
const obtainLocationBtn = document.getElementById('obtainLocationBtn');
const locationInfo = document.getElementById('locationInfo');
const locationText = document.getElementById('locationText');
const mapContainer = document.getElementById('map');
const weatherInfo = document.getElementById('weatherInfo');
const weatherIcon = document.getElementById('weatherIcon');
const weatherLocation = document.getElementById('weatherLocation');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDesc = document.getElementById('weatherDesc');
const weatherHumidity = document.getElementById('weatherHumidity');

// Global variables
let map;
let marker;
let currentPosition = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupEventListeners();
});

// Initialize Google Maps
function initializeMap() {
    const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // New York as default
    
    map = new google.maps.Map(mapContainer, {
        center: defaultLocation,
        zoom: 10,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // Add click listener to map
    map.addListener('click', function(event) {
        const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        updateLocation(clickedLocation);
    });
}

// Setup event listeners
function setupEventListeners() {
    obtainLocationBtn.addEventListener('click', getCurrentLocation);
    document.getElementById('search-button').addEventListener('click', searchLocation);
}

// Get user's current location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }
    
    obtainLocationBtn.classList.add('loading');
    obtainLocationBtn.textContent = 'Getting Location...';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            updateLocation(location);
            obtainLocationBtn.classList.remove('loading');
            obtainLocationBtn.textContent = 'Obtain Location';
        },
        function(error) {
            obtainLocationBtn.classList.remove('loading');
            obtainLocationBtn.textContent = 'Obtain Location';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    showError('Location access denied. Please enable location services.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    showError('Location information is unavailable.');
                    break;
                case error.TIMEOUT:
                    showError('Location request timed out.');
                    break;
                default:
                    showError('An unknown error occurred while getting location.');
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

// Update location and fetch related data
async function updateLocation(location) {
    currentPosition = location;
    
    // Update map
    updateMap(location);
    
    // Get address from coordinates
    const address = await getAddressFromCoordinates(location.lat, location.lng);
    
    // Update location display
    locationText.textContent = address;
    locationInfo.classList.remove('hidden');
    
    // Get weather data
    await getWeatherData(location.lat, location.lng, address);
}

// Update map with new location
function updateMap(location) {
    // Center map on new location
    map.setCenter(location);
    map.setZoom(13);
    
    // Update or create marker
    if (marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Your Location',
            animation: google.maps.Animation.DROP
        });
    }
}

// Get address from coordinates using reverse geocoding
async function getAddressFromCoordinates(lat, lng) {
    try {
        const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${REVERSE_GEOCODING_API_KEY}&no_annotations=1`
        );
        
        if (!response.ok) {
            throw new Error('Reverse geocoding failed');
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const components = result.components;
            
            // Format: City, State, Country
            const city = components.city || components.town || components.village || 'Unknown City';
            const state = components.state || components.county || '';
            const country = components.country || 'Unknown Country';
            
            return state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
        } else {
            return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        }
    } catch (error) {
        console.error('Error getting address:', error);
        return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }
}

// Get weather data for location
async function getWeatherData(lat, lng, locationName) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }
        
        const data = await response.json();
        updateWeatherDisplay(data, locationName);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Failed to fetch weather data. Please check your API key.');
    }
}

// Update weather display
function updateWeatherDisplay(weatherData, locationName) {
    weatherLocation.textContent = locationName;
    weatherTemp.textContent = `${Math.round(weatherData.main.temp)}°C`;
    weatherDesc.textContent = weatherData.weather[0].description;
    weatherHumidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
    
    // Set weather icon
    const iconCode = weatherData.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = weatherData.weather[0].description;
    
    weatherInfo.classList.remove('hidden');
}

// Show error message
function showError(message) {
    alert(message);
}

// Search for a location
async function searchLocation() {
    const searchInput = document.getElementById('search-input').value;
    if (!searchInput) return;

    try {
        const geocodingApiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchInput)}&key=${REVERSE_GEOCODING_API_KEY}&no_annotations=1`;
        const response = await fetch(geocodingApiUrl);
        
        if (!response.ok) {
            throw new Error('Geocoding API request failed');
        }

        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const location = {
                lat: data.results[0].geometry.lat,
                lng: data.results[0].geometry.lng
            };
            const address = await getAddressFromCoordinates(location.lat, location.lng);
            updateLocation(location);
            locationText.textContent = address; // Update location display
        } else {
            showError('Location not found. Please try a different search term.');
        }
    } catch (error) {
        console.error('Error during geocoding:', error);
        showError('Could not search for location. Please try again later.');
    }
}

// Utility function to format coordinates
function formatCoordinates(lat, lng) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
