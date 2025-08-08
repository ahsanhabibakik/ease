# Ease App – Tech Stack and Dependencies

This document lists the main technologies, libraries, and tools used in the Ease project, along with their intended usage and purpose.

---

## 1. Core Frameworks & Languages

- **Next.js**: Main React framework for SSR, routing, API routes, and backend logic (API routes).
- **TypeScript**: Type-safe JavaScript for all app logic and components.
- **React**: UI library for building interactive user interfaces.

## 1a. Backend, Security & Authentication

- **next-auth**: Authentication for Next.js (OAuth, credentials, email, etc.).
- **bcryptjs**: Password hashing for credentials authentication.
- **jsonwebtoken**: JWT-based authentication for APIs.
- **helmet**: Secures HTTP headers in API routes.
- **rate-limiter-flexible**: API rate limiting to prevent abuse.
- **cors**: Cross-origin resource sharing for API routes.
- **dotenv**: Secure environment variable management.
- **zod** or **yup**: Schema validation for API inputs and forms.
- **validator**: Input sanitization and validation.
- **nodemailer**: Sending emails (verification, password reset, etc.).
- **winston** or **pino**: Server-side logging.
- **sentry**/**@sentry/nextjs**: Error monitoring and reporting.

## 2. Styling & UI

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **PostCSS**: CSS processing pipeline (used by Tailwind).
- **Autoprefixer**: Adds vendor prefixes to CSS (via PostCSS).
- **@tailwindcss/forms, typography, aspect-ratio**: Tailwind plugins for enhanced form, text, and layout styling.
- **tw-animate-css**: For subtle, reusable CSS animations.
- **@headlessui/react**: Accessible UI primitives (modals, lists, etc.).
- **clsx**: Utility for conditional classNames.

## 3. Animations & Interactions

- **framer-motion**: Animations and transitions (e.g., fade-ins, petal swipes).
- **react-swipeable** or **keen-slider**: Swipeable carousels for Wisdom Cards.

## 4. State Management & Utilities

- **redux** & **@reduxjs/toolkit**: Global state management (alternative to zustand/jotai).
- **react-redux**: React bindings for Redux.
- **zustand** or **jotai**: Lightweight state management for worries, reflections, etc.
- **date-fns** or **dayjs**: Date/time utilities (for reminders, logs).

## 5. Audio, Timers, and Notifications

- **howler** or **use-sound**: Play calming sounds in Calm Corner.
- **react-timer-hook**: Countdown timers for breathing and meditation.
- **react-toastify**: In-app notifications (optional).

## 6. Icons & Imagery

- **react-icons**: Icon library for hand-drawn style icons.
- **Custom SVGs**: For unique, branded illustrations.

## 7. Backend & Data

**MongoDB / Mongoose**: Document database & ODM used for persistence (users, worries, reflections, settings, auth accounts, verification tokens).
- **LocalStorage**: For offline worry capture and local reminders.

## 8. Testing & Linting

- **eslint**: Linting for code quality.
- **prettier**: Code formatting.
- **jest** or **vitest**: Unit and integration testing.
- **@testing-library/react**: React component testing utilities.

## 9. Project Tooling

- **pnpm**: Fast, disk-efficient package manager (used everywhere in this project).
- **VS Code**: Recommended IDE, configured to use pnpm by default.
- **dotenv**: For managing environment variables in all environments.

---

## Where Each Is Used

- **Next.js API routes**: All backend logic, authentication endpoints, and protected data access.
- **next-auth**: User authentication (sign in, sign up, OAuth, sessions) in API routes and client.
- **bcryptjs**: Password hashing for credentials auth in API routes.
- **jsonwebtoken**: JWT creation/validation for secure API endpoints.
- **helmet**: Secure HTTP headers in API routes.
- **rate-limiter-flexible**: Rate limiting for sensitive API endpoints.
- **cors**: Enable/limit cross-origin requests for APIs.
- **dotenv**: Securely load environment variables for secrets, DB URLs, etc.
- **zod/yup/validator**: Validate and sanitize all user input in forms and APIs.
**mongoose**: Database access for user data, worries, reflections, settings, and auth entities (indexes synced programmatically on startup).
- **nodemailer**: Send verification, password reset, and notification emails.
- **winston/pino**: Log API and server events/errors.
- **sentry**: Monitor and report errors in production.
- **redux/@reduxjs/toolkit/react-redux**: Global state for user, worries, UI, and more (if needed).
- **zustand/jotai**: Local state for simple stores (alternative to Redux).
- **Tailwind CSS, PostCSS, Autoprefixer, tw-animate-css**: Styling in `globals.css` and all UI components.
- **framer-motion**: Animations for Calm Corner, Wisdom Cards, and transitions.
- **react-swipeable/keen-slider**: Wisdom Cards carousel.
- **date-fns/dayjs**: Handling worry timestamps, reminders, and logs.
- **howler/use-sound**: Calming sounds in Calm Corner.
- **react-timer-hook**: Countdown timers for breathing/meditation.
- **@headlessui/react**: Accessible dropdowns, modals, and lists.
- **react-icons/Custom SVGs**: All icons and illustrations.
- **LocalStorage**: Offline worry capture and reminders.
- **eslint, prettier, jest, @testing-library/react**: Code quality and testing.
- **pnpm**: All dependency management and scripts.
- **VS Code**: Main development environment, set to use pnpm.

---

_This document should be updated as new dependencies are added or removed._
