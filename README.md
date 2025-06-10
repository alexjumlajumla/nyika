# Nyika Safaris - Premium African Safari Experiences

A modern safari booking platform inspired by Shadows of Africa, built with Next.js, Tailwind CSS, and Supabase.

## ✨ Features

- 🚀 **Modern UI/UX** with responsive design
- 🏨 **Tour & Accommodation Booking** with real-time availability
- 🌍 **Interactive Destinations** with detailed information
- 📱 **Mobile-First Approach** for all devices
- 📝 **Blog** for travel stories and updates
- 📧 **Contact Form** with email notifications
- 🔒 **Secure Authentication** with Supabase Auth
- 📊 **Admin Dashboard** for content management

## 🛠 Tech Stack

- **Frontend**: Next.js 15.3.3, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: PesaPal Integration
- **Image Storage**: Cloudinary
- **Maps**: Google Maps API
- **Deployment**: Vercel (Frontend), Supabase (Backend & Database)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Supabase](https://supabase.com/) account (for database and auth)
- [Cloudinary](https://cloudinary.com/) account (for image storage)
- [Google Cloud](https://cloud.google.com/) account (for Maps API)
- [PesaPal](https://www.pesapal.com/) account (for payments)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/nyika-safaris.git
   cd nyika-safaris
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   - Update the values in `.env.local` with your configuration

4. **Set up Supabase**:
   - Create a new project at [Supabase](https://supabase.com/)
   - Navigate to the SQL Editor and run the migrations from `supabase/migrations/20240606000000_initial_schema.sql`
   - Enable Row Level Security (RLS) on all tables
   - Set up your preferred authentication providers in the Authentication section

5. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**:
   - Frontend: http://localhost:3000
   - Supabase Dashboard: https://app.supabase.com/project/YOUR_PROJECT_REF

## 🏗 Project Structure

```
nyika-safaris/
├── src/
│   ├── app/                    # App Router pages and routes
│   │   ├── (main)/             # Main marketing site
│   │   ├── [lang]/             # Internationalized routes
│   │   ├── admin/              # Admin dashboard
│   │   └── api/                # API routes
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Utility functions and Supabase client
│   ├── public/                 # Static files
│   ├── styles/                 # Global styles
│   └── types/                  # TypeScript type definitions
├── supabase/
│   └── migrations/            # Database migrations
├── .env.local.example         # Example environment variables
├── package.json               # Project dependencies
└── README.md                  # You are here!
```

## ⚙️ Environment Variables

Copy `.env.local.example` to `.env.local` and update with your credentials:

```bash
# App
NEXT_PUBLIC_APP_NAME="Nyika Safaris"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
# Using Supabase Auth - No additional environment variables needed

# PesaPal
NEXT_PUBLIC_PESAPAL_ENV=sandbox
PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
PESAPAL_IPN_ID=your_pesapal_ipn_id

# Google Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=no-reply@nyikasafaris.com

# ReCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

## 📊 Database Schema

Key tables in the database:

- `tours` - Safari tour packages with details and pricing
- `accommodations` - Lodges and hotels information
- `bookings` - Tour and accommodation reservations
- `profiles` - Extended user profiles
- `testimonials` - Customer reviews and ratings
- `blog_posts` - Travel stories and articles
- `contacts` - Form submissions
- `subscribers` - Newsletter subscriptions

## 🔐 Authentication

Powered by Supabase Auth with:

- Email/password authentication using Supabase Auth
- Social login (Google, GitHub, etc.) via Supabase
- Password reset flow with Supabase
- Email verification with Supabase
- Role-based access control (RBAC)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository to [Vercel](https://vercel.com/)
3. Add all environment variables from `.env.local`
4. Deploy!

### Supabase

1. Push your database migrations to Supabase
2. Set up authentication providers
3. Configure storage buckets if needed
4. Deploy your Edge Functions if any

## 🛠 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run tests
npm test

# Check TypeScript types
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadows of Africa](https://www.shadowsofafrica.com/) for inspiration
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Supabase](https://supabase.com/) for the awesome open-source Firebase alternative

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🙌 Support

If you find this project helpful, please consider giving it a ⭐️ on GitHub!
# nyika
