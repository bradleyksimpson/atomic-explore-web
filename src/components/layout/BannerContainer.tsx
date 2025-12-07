/**
 * Banner Container Component
 * Full-width Atomic container at the top of the page
 * NEW for web - not present in iOS app
 */

import { useAtomicContainer } from '../../hooks/useAtomicContainer';
import { CONTAINERS } from '../../constants/atomic';
import styles from './BannerContainer.module.css';

export function BannerContainer() {
  const { containerRef, isEmpty, height } = useAtomicContainer({
    type: 'banner',
    containerId: CONTAINERS.banner,
  });

  // Don't render anything if no cards
  if (isEmpty && height === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.banner} ${isEmpty ? styles.bannerEmpty : ''}`}
      style={{ minHeight: height > 0 ? height : undefined }}
    >
      <div ref={containerRef} className={styles.container} />
    </div>
  );
}
