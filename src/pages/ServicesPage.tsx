/**
 * Services Page
 * Menu of additional services with Atomic containers
 * Matches iOS ADMenuView
 */

import { useState } from 'react';
import { SingleCard } from '../components/atomic/SingleCard';
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
      {/* Blue header strip for visual continuity */}
      <div className={styles.headerStrip} />

      {/* 2-column layout */}
      <div className={styles.content}>
        {/* Left column: Services menu */}
        <div className={styles.menuColumn}>
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

        {/* Right column: Services Atomic container */}
        <div className={styles.cardColumn}>
          <SingleCard containerId={CONTAINERS.services} />
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
  const isInsurance = service.id === 'insurance';

  return (
    <div className={styles.page}>
      {/* Blue header strip */}
      <div className={styles.headerStrip} />

      {/* 2-column layout for detail view */}
      <div className={styles.content}>
        {/* Left column: Back button, title, and content */}
        <div className={styles.menuColumn}>
          <div className={styles.detailHeader}>
            <button className={styles.backButton} onClick={onBack}>
              <BackIcon />
              <span>Back</span>
            </button>
            <h1 className={styles.detailTitle}>{service.label}</h1>
          </div>

          {isInsurance ? (
            <div className={styles.policiesList}>
              {/* Home and contents policy */}
              <div className={styles.policyCard}>
                <div className={styles.policyIcon} style={{ backgroundColor: '#F06292' }}>
                  <HomeInsuranceIcon />
                </div>
                <div className={styles.policyDetails}>
                  <h3 className={styles.policyTitle}>Home and contents</h3>
                  <p className={styles.policyInfo}>123 Main Street, Testville</p>
                  <p className={styles.policyInfo}>City Town 1100</p>
                  <p className={styles.policyExpiry}>Policy period ends Dec 2027</p>
                </div>
              </div>

              {/* Full car cover policy */}
              <div className={styles.policyCard}>
                <div className={styles.policyIcon} style={{ backgroundColor: '#9CCC65' }}>
                  <CarInsuranceIcon />
                </div>
                <div className={styles.policyDetails}>
                  <h3 className={styles.policyTitle}>Full car cover</h3>
                  <p className={styles.policyInfo}>2022 Ford Ranger</p>
                  <p className={styles.policyInfo}>ABC1000</p>
                  <p className={styles.policyExpiry}>Policy period ends May 2027</p>
                </div>
              </div>
            </div>
          ) : (
            <p className={styles.detailDescription}>
              View your {service.label.toLowerCase()} related messages and actions below.
            </p>
          )}
        </div>

        {/* Right column: Single card container - dynamic height */}
        <div className={styles.cardColumnDetail}>
          {service.containerId && (
            <SingleCard containerId={service.containerId} className={styles.dynamicCard} />
          )}
        </div>
      </div>
    </div>
  );
}

// Insurance policy icons
function HomeInsuranceIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M12 3L4 9v12h16V9l-8-6zm0 2.236L18 10v9H6v-9l6-4.764zM12 11a2 2 0 100 4 2 2 0 000-4zm-1 2a1 1 0 112 0 1 1 0 01-2 0z" />
      <path d="M11 15h2v3h-2z" />
    </svg>
  );
}

function CarInsuranceIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
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
