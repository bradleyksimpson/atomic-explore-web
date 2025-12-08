/**
 * Custom Events Service
 * Sends custom events to Atomic platform via the SDK
 * Used to trigger Action Flows that wait for custom events
 */

import AtomicSDK from '@atomic.io/action-cards-web-sdk';

class EventsService {
  /**
   * Send a custom event via the Atomic SDK
   * Uses the existing session authentication - no separate OAuth needed
   */
  async sendCustomEvent(
    eventName: string,
    properties?: Record<string, unknown>
  ): Promise<void> {
    console.log(`[EventsService] Sending custom event: ${eventName}`, properties || '');

    await AtomicSDK.sendCustomEvent({
      eventName,
      properties,
    });

    console.log(`[EventsService] Custom event '${eventName}' sent successfully`);
  }

  /**
   * Send the resetBannerWeb custom event
   * This resets the banner Action Flow for the current user
   */
  async sendResetBannerEvent(): Promise<void> {
    return this.sendCustomEvent('resetBannerWeb');
  }
}

// Singleton instance
export const eventsService = new EventsService();
