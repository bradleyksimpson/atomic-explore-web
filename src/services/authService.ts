/**
 * Authentication Service
 * Handles JWT token generation for Atomic SDK using the demo token endpoint
 * Compatible with iOS AtomicDemo app for cross-platform user sync
 */

import { ATOMIC_CONFIG } from '../constants/atomic';

const TOKEN_EXPIRY_BUFFER = 70; // seconds before expiry to refresh
const STORAGE_KEYS = {
  atomicId: 'atomic_id',
  userName: 'atomic_user_name',
  cachedToken: 'atomic_cached_token',
  tokenExpiry: 'atomic_token_expiry',
};

interface TokenResponse {
  data: {
    token: string;
    apiKey: string;
  };
  errors?: Array<{ title: string }>;
}

interface DecodedJWT {
  exp?: number;
  sub?: string;
  name?: string;
  [key: string]: unknown;
}

class AuthService {
  private cachedToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Restore from localStorage
    this.cachedToken = localStorage.getItem(STORAGE_KEYS.cachedToken);
    const expiry = localStorage.getItem(STORAGE_KEYS.tokenExpiry);
    this.tokenExpiry = expiry ? parseInt(expiry, 10) : null;
  }

  /**
   * Get or generate Atomic ID
   * This ID syncs the user across iOS and web platforms
   */
  getAtomicId(): string {
    let atomicId = localStorage.getItem(STORAGE_KEYS.atomicId);
    if (!atomicId) {
      atomicId = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEYS.atomicId, atomicId);
    }
    return atomicId;
  }

  /**
   * Set Atomic ID (for syncing with existing iOS user)
   */
  setAtomicId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.atomicId, id);
    // Clear cached token when ID changes
    this.clearCache();
  }

  /**
   * Get user name
   */
  getUserName(): string {
    return localStorage.getItem(STORAGE_KEYS.userName) || '';
  }

  /**
   * Set user name
   */
  setUserName(name: string): void {
    localStorage.setItem(STORAGE_KEYS.userName, name);
  }

  /**
   * Check if user is "logged in" (has Atomic ID)
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.atomicId);
  }

  /**
   * Fetch authentication token from demo endpoint
   * This is the session delegate callback for Atomic SDK
   */
  async getAuthToken(): Promise<string> {
    // Check cached token validity
    if (this.cachedToken && this.isTokenValid()) {
      return this.cachedToken;
    }

    const atomicId = this.getAtomicId();
    const userName = this.getUserName();

    // Build claims object
    const claims = JSON.stringify({ name: userName });

    // Construct token URL (matching iOS implementation)
    const tokenUrl = `${ATOMIC_CONFIG.baseUrl}/${ATOMIC_CONFIG.environmentId}/unauthenticated-token/${atomicId}/${ATOMIC_CONFIG.apiKey}?claims=${encodeURIComponent(claims)}`;

    try {
      const response = await fetch(tokenUrl);
      const data: TokenResponse = await response.json();

      if (data.errors && data.errors.length > 0) {
        console.error('Auth token error:', data.errors[0].title);
        throw new Error(data.errors[0].title);
      }

      if (data.data?.token) {
        this.cachedToken = data.data.token;
        this.tokenExpiry = this.extractTokenExpiry(data.data.token);

        // Persist to localStorage
        localStorage.setItem(STORAGE_KEYS.cachedToken, this.cachedToken);
        if (this.tokenExpiry) {
          localStorage.setItem(STORAGE_KEYS.tokenExpiry, this.tokenExpiry.toString());
        }

        return this.cachedToken;
      }

      throw new Error('No token in response');
    } catch (error) {
      console.error('Failed to fetch auth token:', error);
      throw error;
    }
  }

  /**
   * Clear all authentication data
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.atomicId);
    localStorage.removeItem(STORAGE_KEYS.userName);
    this.clearCache();
  }

  /**
   * Clear cached token
   */
  private clearCache(): void {
    this.cachedToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem(STORAGE_KEYS.cachedToken);
    localStorage.removeItem(STORAGE_KEYS.tokenExpiry);
  }

  /**
   * Check if cached token is still valid
   */
  private isTokenValid(): boolean {
    if (!this.cachedToken || !this.tokenExpiry) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    return this.tokenExpiry - now > TOKEN_EXPIRY_BUFFER;
  }

  /**
   * Extract expiry timestamp from JWT
   */
  private extractTokenExpiry(token: string): number | null {
    try {
      const decoded = this.decodeJWT(token);
      return decoded?.exp || null;
    } catch {
      return null;
    }
  }

  /**
   * Decode JWT payload (without verification)
   */
  private decodeJWT(token: string): DecodedJWT | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;

      let payload = parts[1];

      // Add padding if needed
      const paddingLength = (4 - (payload.length % 4)) % 4;
      payload += '='.repeat(paddingLength);

      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}

// Singleton instance
export const authService = new AuthService();

// Export the token getter for Atomic SDK session delegate
export const getAtomicToken = async (): Promise<string> => {
  return authService.getAuthToken();
};
