/**
 * Atomic SDK Service
 * Handles SDK initialization and container management
 */

import AtomicSDK from '@atomic.io/action-cards-web-sdk';
import { ATOMIC_CONFIG, CONTAINERS } from '../constants/atomic';
import { getAtomicToken } from './authService';

// Container instance type (the SDK returns objects with stop/destroy methods)
interface ContainerInstance {
  stop?: () => void;
  destroy?: () => void;
}

class AtomicService {
  private initialized = false;
  private containerInstances: Map<string, ContainerInstance | (() => void)> = new Map();

  /**
   * Initialize the Atomic SDK
   * Should be called once when the app starts
   */
  initialize(): void {
    if (this.initialized) {
      console.log('Atomic SDK already initialized');
      return;
    }

    try {
      // Initialize SDK with API host, key, and environment
      AtomicSDK.initialise(
        ATOMIC_CONFIG.baseUrl,
        ATOMIC_CONFIG.apiKey,
        ATOMIC_CONFIG.environmentId
      );

      // Set session delegate for JWT authentication
      AtomicSDK.setSessionDelegate(getAtomicToken);

      // Enable debug mode in development
      if (import.meta.env.DEV) {
        console.log('Atomic SDK initialized in debug mode');
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Atomic SDK:', error);
      throw error;
    }
  }

  /**
   * Check if SDK is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Cleanup helper for container instances
   */
  private cleanupInstance(instance: ContainerInstance | (() => void) | undefined): void {
    if (!instance) return;

    if (typeof instance === 'function') {
      instance();
    } else if (instance.stop) {
      instance.stop();
    } else if (instance.destroy) {
      instance.destroy();
    }
  }

  /**
   * Create a horizontal stream container
   */
  createHorizontalContainer(
    element: HTMLElement,
    containerId: string,
    cardWidth: number = 370,
    options: {
      onCardCountChanged?: (visible: number, total: number) => void;
      onSizeChanged?: (width: number, height: number) => void;
    } = {}
  ): () => void {
    const instance = AtomicSDK.embed(element, {
      streamContainerId: containerId,
      horizontalContainerConfig: {
        enabled: true,
        cardWidth,
        emptyStyle: 'shrink',
        scrollMode: 'snap',
        lastCardAlignment: 'left',
      },
      enabledUiElements: {
        cardListHeader: false,
        cardListToast: false,
      },
      onCardCountChanged: options.onCardCountChanged,
      onSizeChanged: options.onSizeChanged,
    });

    this.containerInstances.set(containerId, instance);

    return () => {
      this.cleanupInstance(instance);
      this.containerInstances.delete(containerId);
    };
  }

  /**
   * Create a vertical stream container
   */
  createVerticalContainer(
    element: HTMLElement,
    containerId: string,
    options: {
      title?: string;
      showHeader?: boolean;
      showToast?: boolean;
      onCardCountChanged?: (visible: number, total: number) => void;
      onSizeChanged?: (width: number, height: number) => void;
    } = {}
  ): () => void {
    const config: Parameters<typeof AtomicSDK.embed>[1] = {
      streamContainerId: containerId,
      enabledUiElements: {
        cardListHeader: options.showHeader ?? true,
        cardListToast: options.showToast ?? true,
      },
      onCardCountChanged: options.onCardCountChanged,
      onSizeChanged: options.onSizeChanged,
    };

    if (options.title) {
      config.customStrings = {
        cardListTitle: options.title,
      };
    }

    const instance = AtomicSDK.embed(element, config);
    this.containerInstances.set(containerId, instance);

    return () => {
      this.cleanupInstance(instance);
      this.containerInstances.delete(containerId);
    };
  }

  /**
   * Create a single card container (for banner)
   */
  createSingleCardContainer(
    element: HTMLElement,
    containerId: string,
    options: {
      onSizeChanged?: (width: number, height: number) => void;
      onCardCountChanged?: (visible: number, total: number) => void;
    } = {}
  ): () => void {
    const instance = AtomicSDK.singleCard(element, {
      streamContainerId: containerId,
      onSizeChanged: options.onSizeChanged,
      onCardCountChanged: options.onCardCountChanged,
    });

    const key = `single-${containerId}`;
    this.containerInstances.set(key, instance);

    return () => {
      this.cleanupInstance(instance);
      this.containerInstances.delete(key);
    };
  }

  /**
   * Create an embedded container with overlay subviews
   * Use this for containers where subviews should appear as overlays
   * (Payees, Insurance, Services)
   */
  createEmbedContainer(
    element: HTMLElement,
    containerId: string,
    options: {
      onSizeChanged?: (width: number, height: number) => void;
      onCardCountChanged?: (visible: number, total: number) => void;
    } = {}
  ): () => void {
    const instance = AtomicSDK.embed(element, {
      streamContainerId: containerId,
      enabledUiElements: {
        cardListHeader: false,
        cardListToast: false,
      },
      onSizeChanged: options.onSizeChanged,
      onCardCountChanged: options.onCardCountChanged,
    });

    const key = `embed-${containerId}`;
    this.containerInstances.set(key, instance);

    return () => {
      this.cleanupInstance(instance);
      this.containerInstances.delete(key);
    };
  }

  /**
   * Create a banner container (horizontal with special styling)
   */
  createBannerContainer(
    element: HTMLElement,
    containerId: string,
    options: {
      onCardCountChanged?: (visible: number, total: number) => void;
      onSizeChanged?: (width: number, height: number) => void;
    } = {}
  ): () => void {
    // Use single card for banner - shows one card at a time
    const instance = AtomicSDK.singleCard(element, {
      streamContainerId: containerId,
      onSizeChanged: options.onSizeChanged,
      onCardCountChanged: options.onCardCountChanged,
    });

    const key = `banner-${containerId}`;
    this.containerInstances.set(key, instance);

    return () => {
      this.cleanupInstance(instance);
      this.containerInstances.delete(key);
    };
  }

  /**
   * Launch modal container
   */
  launchModal(
    containerId: string,
    options: {
      onClose?: () => void;
      maxWidth?: number;
    } = {}
  ): () => void {
    const instance = AtomicSDK.modalStreamContainer({
      streamContainerId: containerId,
      cardMaximumWidth: options.maxWidth ?? 400,
      cardHorizontalAlignment: 'center',
      modalContainerPositioning: 'center',
      modalContainerVerticalPadding: 50,
      onModalStreamToggled: (isOpen?: boolean) => {
        if (isOpen === false && options.onClose) {
          options.onClose();
        }
      },
    });

    const key = `modal-${containerId}`;
    if (instance) {
      this.containerInstances.set(key, instance as ContainerInstance);
    }

    return () => {
      if (instance) {
        this.cleanupInstance(instance as ContainerInstance);
      }
      this.containerInstances.delete(key);
    };
  }

  /**
   * Get user metrics (card counts)
   */
  async getUserMetrics(): Promise<{
    totalCards: number;
    unseenCards: number;
    containerCounts: Record<string, { total: number; unseen: number }>;
  }> {
    const metrics = await AtomicSDK.requestUserMetrics();

    const containerCounts: Record<string, { total: number; unseen: number }> = {};

    Object.entries(CONTAINERS).forEach(([key, id]) => {
      containerCounts[key] = {
        total: metrics.totalCardsForStreamContainer(id),
        unseen: metrics.unseenCardsForStreamContainer(id),
      };
    });

    return {
      totalCards: metrics.totalCards(),
      unseenCards: metrics.unseenCards(),
      containerCounts,
    };
  }

  /**
   * Observe SDK events
   */
  observeEvents(callback: (event: unknown) => void): void {
    AtomicSDK.observeSDKEvents(callback);
  }

  /**
   * Cleanup a specific container
   */
  cleanupContainer(containerId: string): void {
    const instance = this.containerInstances.get(containerId);
    if (instance) {
      this.cleanupInstance(instance);
      this.containerInstances.delete(containerId);
    }
  }

  /**
   * Cleanup all containers
   */
  cleanupAll(): void {
    this.containerInstances.forEach((instance) => {
      this.cleanupInstance(instance);
    });
    this.containerInstances.clear();
  }

  /**
   * Logout and cleanup
   */
  async logout(): Promise<void> {
    this.cleanupAll();
    await AtomicSDK.logout(false);
    this.initialized = false;
  }
}

// Singleton instance
export const atomicService = new AtomicService();
