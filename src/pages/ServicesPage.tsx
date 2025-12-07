/**
 * Services Page
 * Menu of additional services with Atomic containers
 * Matches iOS ADMenuView
 */

import { useState } from 'react';
import { HorizontalStream } from '../components/atomic/HorizontalStream';
import { useCardCounts } from '../hooks/useAtomicContainer';
import { CONTAINERS } from '../constants/atomic';
import styles from './ServicesPage.module.css';

interface ServiceItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  containerId?: string;
  badge?: boolean;
}

const serviceItems: ServiceItem[] = [
  {
    id: 'payees',
    label: 'Payees',
    icon: <PayeesIcon />,
    containerId: CONTAINERS.payees,
    badge: true,
  },
  {
    id: 'international',
    label: 'International',
    icon: <InternationalIcon />,
  },
  {
    id: 'upcoming',
    label: 'Upcoming Payments',
    icon: <UpcomingIcon />,
  },
  {
    id: 'cards',
    label: 'Cards',
    icon: <CardsIcon />,
  },
  {
    id: 'insurance',
    label: 'Insurance',
    icon: <InsuranceIcon />,
    containerId: CONTAINERS.insurance,
    badge: true,
  },
];

export function ServicesPage() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const { byContainer } = useCardCounts();

  const handleServiceClick = (service: ServiceItem) => {
    if (service.containerId) {
      setSelectedService(service);
    } else {
      // For services without containers, show a placeholder
      alert(`${service.label} coming soon!`);
    }
  };

  if (selectedService) {
    return (
      <ServiceDetailView
        service={selectedService}
        onBack={() => setSelectedService(null)}
      />
    );
  }

  return (
    <div className={styles.page}>
      {/* Services header with Atomic container */}
      <div className={styles.heroSection}>
        <HorizontalStream containerId={CONTAINERS.services} cardWidth={340} />
      </div>

      {/* Services menu */}
      <div className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Services</h2>
        <div className={styles.servicesList}>
          {serviceItems.map((service) => {
            const badgeCount = service.badge && service.containerId
              ? byContainer[service.id]?.unseen ?? 0
              : 0;

            return (
              <button
                key={service.id}
                className={styles.serviceItem}
                onClick={() => handleServiceClick(service)}
              >
                <span className={styles.serviceIcon}>{service.icon}</span>
                <span className={styles.serviceLabel}>{service.label}</span>
                {badgeCount > 0 && (
                  <span className={styles.badge}>{badgeCount}</span>
                )}
                <span className={styles.chevron}>
                  <ChevronIcon />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface ServiceDetailViewProps {
  service: ServiceItem;
  onBack: () => void;
}

function ServiceDetailView({ service, onBack }: ServiceDetailViewProps) {
  return (
    <div className={styles.detailPage}>
      <div className={styles.detailHeader}>
        <button className={styles.backButton} onClick={onBack}>
          <BackIcon />
          <span>Back</span>
        </button>
        <h1 className={styles.detailTitle}>{service.label}</h1>
      </div>

      <div className={styles.detailContent}>
        {service.containerId && (
          <HorizontalStream
            containerId={service.containerId}
            cardWidth={370}
          />
        )}
      </div>
    </div>
  );
}

// Icons
function ChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function PayeesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function InternationalIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function UpcomingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function CardsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function InsuranceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
