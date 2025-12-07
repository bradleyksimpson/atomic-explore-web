/**
 * Single Card Component
 * Displays one Atomic card at a time
 * Used for focused card experiences
 * Height is dynamic based on card content
 */

import { useAtomicContainer } from '../../hooks/useAtomicContainer';
import styles from './SingleCard.module.css';

interface SingleCardProps {
  containerId: string;
  className?: string;
  minHeight?: number;
}

export function SingleCard({ containerId, className = '', minHeight = 60 }: SingleCardProps) {
  const { containerRef, isEmpty, height } = useAtomicContainer({
    type: 'single',
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
