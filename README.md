# Camping Tracker

Camping Tracker is a tool designed to help outdoor enthusiasts efficiently find and track available campsites across
multiple camping platforms, such as Recreation.gov and ReserveCalifornia.com. The application fetches availability data
for specific campgrounds, filters it according to user preferences, and notifies users of new camping opportunities via
Telegram.

## Features

- **Find Campsites**: Search for campsites within a specified date range and filter by preferred days of the week or
  specific dates.
- **Multi-Platform Support**: Fetch data from popular platforms like Recreation.gov and ReserveCalifornia.com.
- **Custom Filtering**: Filter available campsites based on:
  - Specific days of the week (e.g., weekends only).
  - Specific dates (e.g., holidays or special occasions).
- **Notification Integration**: Automatically post new camping opportunities to a Telegram channel for quick access.

## How It Works

1. **Fetch Data**: Retrieve campsite availability data for the given campground ID and date range.
2. **Process Data**:
   - Identify available campsites.
   - Filter results based on user-defined criteria.
   - Exclude previously found campsites to avoid duplicate notifications.
3. **Notify**: Send a message to a Telegram channel with details of newly available campsites.

## Installation

1. Create a `.env.local` file in the root directory and add the required environment variables from `.env.example`.
2. `npm install`

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
