<div align="center">
  <!-- <img src="./public/logo.svg" alt="Drop.ly Logo" width="120" /> -->
  <h1 align="center">Drop.ly</h1>
  <p align="center">
    A modern price-tracking web application that helps you save money by monitoring product prices from any e-commerce URL and alerting you when they drop.
  </p>
</div>

Drop.ly is a full-stack application built with Next.js that allows users to add products via URL, automatically scrapes the product details, and stores them in a database. A scheduled background job periodically checks for price changes and sends email notifications to users when a price drop is detected.

## Features

Drop.ly comes packed with features designed for a seamless price-tracking experience:

- **Smart Web Scraping**: Simply paste a product URL, and Drop.ly automatically extracts key information like name, price, and image using **Firecrawl**.
- **User Authentication**: Secure user accounts and data with email and password authentication powered by **Supabase Auth**.
- **Product Tracking Dashboard**: A clean, responsive dashboard where users can view all their tracked products at a glance.
- **Detailed Price History**: An interactive chart for each product visualizes its price history, helping users identify trends.
- **Automated Price Checks**: A cron job runs on a schedule to check for price updates on all tracked products, ensuring data is always current.
- **Instant Email Alerts**: Receive beautifully formatted email notifications via **Resend** the moment a product's price drops.
- **Modern, Performant UI**: Built with **Next.js 16** and **React 19**, styled with **Tailwind CSS** and **shadcn/ui** for a fast and accessible user experience.

## Tech Stack

The project leverages a modern, full-stack JavaScript ecosystem:

- **Framework**: [Next.js](https://nextjs.org/) (using App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for components
- **Database & Auth**: [Supabase](https://supabase.io/) for PostgreSQL database, user authentication, and storage.
- **Web Scraping**: [Firecrawl](https://firecrawl.dev/) for reliable data extraction from e-commerce sites.
- **Email Notifications**: [Resend](https://resend.com/) for sending transactional price drop alerts.
- **Deployment**: Hosted on [Vercel](https://vercel.com/).

## Project Structure

The codebase is organized to maintain a clean separation of concerns:

```
./
├── app/
│   ├── (auth)/         # Authentication pages (login, signup)
│   ├── (root)/         # Core application pages (dashboard)
│   ├── api/            # API routes, including the cron endpoint
│   ├── action.js       # Server Actions for database mutations
│   └── layout.js       # Root layout
├── components/
│   ├── AuthModal.jsx   # User authentication component
│   ├── PriceChart.jsx  # Chart for displaying price history
│   └── ProductCard.jsx # Component for displaying a single product
├── lib/
│   ├── email.js        # Resend email sending logic
│   ├── firecrawl.js    # Firecrawl scraping utility
│   └── supabase.js     # Supabase client and helper functions
└── public/             # Static assets like images and logos
```

## Database Schema

The application relies on two primary tables in the Supabase PostgreSQL database:

#### `products`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `user_id` | `uuid` | Foreign Key to `auth.users` |
| `url` | `text` | The original product URL |
| `name` | `text` | Product name |
| `image_url` | `text` | URL of the product image |
| `current_price` | `float8` | The most recently checked price |
| `currency` | `text` | Price currency (e.g., "USD") |
| `created_at` | `timestamptz` | Timestamp of creation |
| `updated_at` | `timestamptz` | Timestamp of the last check |

#### `price_history`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `product_id` | `uuid` | Foreign Key to `products.id` |
| `price` | `float8` | The price at the time of check |
| `checked_at` | `timestamptz` | Timestamp of the price check |

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/drop.ly.git
cd drop.ly
```

### 2. Install Dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a .env.local file in the project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_sender_email
CRON_SECRET=your_secret_for_cron_requests
```

### 3. Run the app locally

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Build and Lint

```bash
npm run build
npm run lint
```

## Price Monitoring Cron

The app includes a scheduled endpoint for checking tracked products:

- Endpoint: /api/cron/check-prices
- Method: POST
- Protected with a bearer token using CRON_SECRET

You can trigger it manually with:

```bash
curl -X POST http://localhost:3000/api/cron/check-prices \
  -H "Authorization: Bearer your_cron_secret"
```

## Deployment

This project is well-suited for deployment on Vercel. Make sure all environment variables above are configured in your hosting platform before deploying.

## License

This project is for personal and educational use.
