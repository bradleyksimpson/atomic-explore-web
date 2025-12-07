/**
 * Single Card Component
 * Displays one Atomic card at a time
 * Used for focused card experiences
 */

import { useAtomicContainer } from '../../hooks/useAtomicContainer';
import styles from './SingleCard.module.css';

interface SingleCardProps {
  containerId: string;
  className?: string;
}

export function SingleCard({ containerId, className = '' }: SingleCardProps) {
  const { containerRef, isEmpty, height } = useAtomicContainer({
    type: 'single',
    containerId,
  });

  return (
    <div
      className={`${styles.wrapper} ${className} ${isEmpty ? styles.empty : ''}`}
      style={{ minHeight: height > 0 ? height : 200 }}
    >
      <div ref={containerRef} className={styles.container} />
    </div>
  );
}
