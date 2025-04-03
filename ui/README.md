# Blog Frontend UI

This is the frontend UI for the blog application, built with React, TypeScript, and Vite.

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- styled-components (being phased out in favor of Tailwind CSS)

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Styling

The project is transitioning from styled-components to Tailwind CSS. See the [TAILWIND_MIGRATION_PLAN.md](./TAILWIND_MIGRATION_PLAN.md) for details on the migration process.

### Tailwind CSS

Tailwind utility classes should be used for new components and when updating existing ones. The project uses a custom Tailwind configuration that includes:

- Custom color variables that match the existing design system
- Custom font settings
- Responsive breakpoints

### styled-components

While the project is migrating to Tailwind CSS, some components still use styled-components. The goal is to gradually phase out this library in favor of Tailwind.

## Server-side Rendering

The application uses GraalJS for server-side rendering. The build process creates both client and server builds:

```bash
# Build client-side bundle
npm run build:client

# Build server-side bundle
npm run build:server
```

## Integration with Backend

The UI integrates with a Spring Boot backend. During development, API requests are proxied to the backend server running on port 8080.
