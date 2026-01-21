# YelpCamp

A full-stack web application for campground reviews built with Node.js, Express, MongoDB, and Bootstrap.

## Features

- User authentication and authorization
- CRUD operations for campgrounds and reviews
- Image upload with Cloudinary
- Interactive maps
- Security features with Helmet and sanitization

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your environment variables
4. Run the application: `npm start`

## Environment Variables

- `DB_URL`: MongoDB connection string
- `SESSION_SECRET`: Secret for session encryption
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_KEY`: Cloudinary API key
- `CLOUDINARY_SECRET`: Cloudinary API secret
- `MAPTILER_API_KEY`: MapTiler API key (optional)

## Deployment

This app is configured for deployment on Render.com or similar platforms.