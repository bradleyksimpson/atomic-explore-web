/**
 * Settings Page
 * User settings including Atomic ID login and dark mode
 */

import { useState } from 'react';
import { authService } from '../services/authService';
import { atomicService } from '../services/atomicService';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const [atomicId, setAtomicId] = useState(authService.getAtomicId());
  const [userName, setUserName] = useState(authService.getUserName());
  const [editingId, setEditingId] = useState(false);
  const [tempId, setTempId] = useState(atomicId);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const handleSaveId = () => {
    if (tempId && tempId !== atomicId) {
      authService.setAtomicId(tempId);
      setAtomicId(tempId);
      // Re-initialize SDK with new user
      atomicService.logout().then(() => {
        atomicService.initialize();
      });
    }
    setEditingId(false);
  };

  const handleSaveName = () => {
    authService.setUserName(userName);
  };

  const handleGenerateNewId = () => {
    const newId = crypto.randomUUID();
    setTempId(newId);
  };

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    if (newValue) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out? This will clear your Atomic ID.')) {
      await atomicService.logout();
      authService.logout();
      setAtomicId('');
      setUserName('');
      window.location.reload();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Settings</h1>

        {/* User Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>User Profile</h2>

          <div className={styles.field}>
            <label className={styles.label}>Your Name</label>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.input}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
              <button
                className={styles.saveButton}
                onClick={handleSaveName}
              >
                Save
              </button>
            </div>
            <p className={styles.hint}>
              This name is used for personalization in Atomic cards
            </p>
          </div>
        </section>

        {/* Atomic ID Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Atomic ID</h2>
          <p className={styles.description}>
            Your Atomic ID syncs your cards across devices. Use the same ID on iOS and web to see the same content.
          </p>

          <div className={styles.field}>
            <label className={styles.label}>Current Atomic ID</label>
            {editingId ? (
              <div className={styles.editGroup}>
                <input
                  type="text"
                  className={styles.input}
                  value={tempId}
                  onChange={(e) => setTempId(e.target.value)}
                  placeholder="Enter Atomic ID"
                />
                <div className={styles.editActions}>
                  <button
                    className={styles.secondaryButton}
                    onClick={handleGenerateNewId}
                  >
                    Generate New
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      setTempId(atomicId);
                      setEditingId(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.saveButton}
                    onClick={handleSaveId}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.valueGroup}>
                <code className={styles.idValue}>{atomicId}</code>
                <button
                  className={styles.editButton}
                  onClick={() => setEditingId(true)}
                >
                  Edit
                </button>
              </div>
            )}
            <p className={styles.hint}>
              Copy this ID from your iOS app settings to sync your account
            </p>
          </div>
        </section>

        {/* Appearance Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Appearance</h2>

          <div className={styles.toggleField}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Dark Mode</span>
              <span className={styles.toggleHint}>
                Switch between light and dark theme
              </span>
            </div>
            <button
              className={`${styles.toggle} ${darkMode ? styles.toggleOn : ''}`}
              onClick={toggleDarkMode}
              role="switch"
              aria-checked={darkMode}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Account</h2>
          <button
            className={styles.dangerButton}
            onClick={handleLogout}
          >
            Log Out & Clear Data
          </button>
        </section>

        {/* About */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About</h2>
          <div className={styles.aboutInfo}>
            <p>Atomic Explore Web</p>
            <p className={styles.version}>Version 1.0.0</p>
            <p className={styles.powered}>
              Powered by{' '}
              <a href="https://atomic.io" target="_blank" rel="noopener noreferrer">
                Atomic
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
