/**
 * Horizontal Stream Component
 * Wrapper for horizontal Atomic containers
 * Matches iOS HorizontalContainer usage
 */

import { useAtomicContainer } from '../../hooks/useAtomicContainer';
import styles from './HorizontalStream.module.css';

interface HorizontalStreamProps {
  containerId: string;
  cardWidth?: number;
  className?: string;
}

export function HorizontalStream({
  containerId,
  cardWidth = 370,
  className = '',
}: HorizontalStreamProps) {
  const { containerRef, isEmpty, height } = useAtomicContainer({
    type: 'horizontal',
    containerId,
    cardWidth,
  });

  return (
    <div
      className={`${styles.wrapper} ${className} ${isEmpty ? styles.empty : ''}`}
      style={{
        minHeight: height > 0 ? height : 120, // Always have min height for SDK to render
      }}
    >
      <div ref={containerRef} className={styles.container} />
    </div>
  );
}
