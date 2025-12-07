// Atomic SDK Configuration
// These values match the iOS AtomicDemo app for cross-platform user sync

export const ATOMIC_CONFIG = {
  baseUrl: 'https://50-11.client-api.atomic.io',
  environmentId: 'wWpqLVBD',
  apiKey: 'test_key_2',
  orgId: '50-11',
} as const;

// Stream Container IDs
export const CONTAINERS = {
  // Banner - top of page (NEW for web)
  banner: 'xWM8Pmqa',

  // Home/Account page
  accountsHome: 'gp3EkNqm',
  accountsFooter: 'Lqne7B5X',
  rainyDay: 'xpVDrGq8',

  // Messages
  secureMessages: '05oRA3p7',

  // Transfers & Payments
  transfers: 'aqld31qP',
  payments: 'gp3DQ65m',

  // Services
  services: 'g5eMZV50',
  payees: '6q7RkA5J',
  insurance: 'xpVDwQq8',

  // Home Loans
  homeLoans: 'Zpv0ABql',
  mortgage: 'g5eMAy50',

  // Modal overlay
  overlay: '95DrmdWz',
} as const;

// Layout constants matching iOS app
export const LAYOUT = {
  horizontalPadding: 24,
  containerPadding: 14,
  cardWidth: 370,
  cardWidthSmall: 340, // for screens < 440px
  cornerRadius: 15,
} as const;
