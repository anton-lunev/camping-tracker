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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically
optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for
more details.
