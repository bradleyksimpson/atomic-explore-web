# Atomic Explore Web

A web application based on the Atomic Explore iOS app, demonstrating the Atomic SDK integration for web. This is a demo banking app that showcases Atomic's action cards in a web environment.

## Features

- **Cross-platform user sync** - Use the same Atomic ID on iOS and web to see the same cards
- **Multiple container types** - Horizontal streams, vertical embeds, single cards, and banners
- **Dark mode support** - Automatic system preference detection with manual override
- **Responsive design** - Works on desktop and mobile browsers

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for fast development and building
- **React Router v6** for navigation
- **Atomic SDK v25.3.0** for action cards

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── layout/       # Layout components (Header, Sidebar, Banner)
│   ├── atomic/       # Atomic SDK wrapper components
│   ├── accounts/     # Account-related components
│   ├── services/     # Services menu components
│   └── shared/       # Shared/reusable components
├── pages/            # Page components
├── services/         # API and SDK services
├── hooks/            # Custom React hooks
├── styles/           # Global styles and design tokens
└── constants/        # Configuration constants
```

## Atomic SDK Integration

The app uses the following Atomic container types:

| Container | Usage |
|-----------|-------|
| Banner (xWM8Pmqa) | Top-of-page promotional content |
| Horizontal Stream | Hero cards, account features |
| Vertical Stream | Message center |
| Modal | Overlay notifications |

## User Sync

To sync your web session with your iOS app:

1. Open the iOS Atomic Explore app
2. Go to Settings and copy your Atomic ID
3. On the web app, go to Settings
4. Paste your Atomic ID to sync your cards

## Environment

The app connects to the Atomic demo environment:
- **API Host**: `https://50-11.client-api.atomic.io`
- **Environment ID**: `wWpqLVBD`

## License

This is a demo application for Atomic SDK integration.
