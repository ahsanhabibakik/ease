# Ease App – Tech Stack and Dependencies

This document lists the main technologies, libraries, and tools used in the Ease project, along with their intended usage and purpose.

---

## 1. Core Frameworks & Languages
- **Next.js**: Main React framework for SSR, routing, and API routes.
- **TypeScript**: Type-safe JavaScript for all app logic and components.
- **React**: UI library for building interactive user interfaces.

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
- **Firebase**: NoSQL database, authentication, and serverless functions.
- **LocalStorage**: For offline worry capture and local reminders.

## 8. Testing & Linting
- **eslint**: Linting for code quality.
- **prettier**: Code formatting.
- **jest** or **vitest**: Unit and integration testing.
- **@testing-library/react**: React component testing utilities.

## 9. Project Tooling
- **pnpm**: Fast, disk-efficient package manager (used everywhere in this project).
- **VS Code**: Recommended IDE, configured to use pnpm by default.

---

## Where Each Is Used

- **Tailwind CSS, PostCSS, Autoprefixer, tw-animate-css**: Styling in `globals.css` and all UI components.
- **framer-motion**: Animations for Calm Corner, Wisdom Cards, and transitions.
- **react-swipeable/keen-slider**: Wisdom Cards carousel.
- **zustand/jotai**: State for worries, reflections, and UI state.
- **date-fns/dayjs**: Handling worry timestamps, reminders, and logs.
- **howler/use-sound**: Calming sounds in Calm Corner.
- **react-timer-hook**: Countdown timers for breathing/meditation.
- **@headlessui/react**: Accessible dropdowns, modals, and lists.
- **react-icons/Custom SVGs**: All icons and illustrations.
- **Firebase**: User data, authentication, reminders, and analytics.
- **LocalStorage**: Offline worry capture and reminders.
- **eslint, prettier, jest, @testing-library/react**: Code quality and testing.
- **pnpm**: All dependency management and scripts.
- **VS Code**: Main development environment, set to use pnpm.

---

_This document should be updated as new dependencies are added or removed._
