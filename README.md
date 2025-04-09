
# Abengisme

A modern, full-stack blog platform built with React, Express, and TypeScript, featuring a minimalist design focused on content and user experience.

## Features

- 🎨 Modern, responsive design with dark mode support
- 📱 Mobile-friendly with bottom navigation
- 📝 Rich content management system
- 🔒 Secure authentication system
- 📊 Built-in analytics dashboard
- 🔍 SEO optimized with automatic sitemap generation
- 💨 Fast performance with Vite
- 🎯 TypeScript for type safety
- 🗃️ PostgreSQL database with Drizzle ORM
- 📬 Newsletter subscription system
- 🔄 Social sharing capabilities

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **Authentication**: Session-based with Passport.js
- **Deployment**: Replit

## Getting Started

1. Fork this template on Replit
2. The development server will start automatically
3. Visit the app at your Replit URL

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions and API clients
├── server/              # Backend Express application
│   ├── routes.ts        # API routes
│   ├── auth.ts          # Authentication logic
│   ├── db.ts           # Database configuration
│   └── seed.ts         # Database seeding
└── shared/             # Shared TypeScript types and schemas
```

## Features Documentation

### Authentication
- Session-based authentication using Passport.js
- Protected routes for admin functionality
- Password requirements enforcement

### Content Management
- Create, edit, and delete blog posts
- Rich text editing
- Image upload support
- Category management
- Featured posts system

### User Experience
- Responsive design for all screen sizes
- Dark mode support
- Mobile-optimized navigation
- Toast notifications
- Loading states and skeletons

### SEO & Performance
- Meta tags management
- Automatic sitemap generation
- Optimized image loading
- Client-side caching

## Development

The project uses npm scripts for development:

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run check    # Type checking
```

## Database Management

- Uses Drizzle ORM for type-safe database operations
- Automatic database migrations
- Seeding system for initial data

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session management
- `NODE_ENV`: Development/production environment

## Contributing

Feel free to fork this template and customize it for your needs. If you find any bugs or have suggestions, please open an issue on the project's Replit page.

## License

MIT License
