/**
 * Single Card Component
 * Displays one Atomic card at a time
 * Used for focused card experiences
 * Height is dynamic based on card content
 *
 * Set overlaySubviews=true to use embed container type,
 * which displays subviews as overlays inside the container frame
 */

import { useAtomicContainer } from '../../hooks/useAtomicContainer';
import styles from './SingleCard.module.css';

interface SingleCardProps {
  containerId: string;
  className?: string;
  minHeight?: number;
  /** Use embed container type for overlay subviews (for Payees, Insurance, Services) */
  overlaySubviews?: boolean;
}

export function SingleCard({
  containerId,
  className = '',
  minHeight = 60,
  overlaySubviews = false,
}: SingleCardProps) {
  const { containerRef, isEmpty, height } = useAtomicContainer({
    type: overlaySubviews ? 'embed' : 'single',
    containerId,
  });

  // Use the reported height from SDK, or fallback to minHeight while loading
  const actualHeight = height > 0 ? height : minHeight;

  return (
    <div
      className={`${styles.wrapper} ${className} ${isEmpty ? styles.empty : ''}`}
      style={{ minHeight: isEmpty ? 0 : actualHeight }}
    >
      <div ref={containerRef} className={styles.container} />
    </div>
  );
}
