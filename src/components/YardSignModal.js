'use client';

import { useYardSign } from '@/context/YardSignContext';
import YardSignForm from './YardSignForm';
import styles from './Modal.module.css';

export default function YardSignModal() {
  const { isOpen, closeYardSign } = useYardSign();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeYardSign}>
      <div
        className={`${styles.modal} ${styles.compact}`}
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the form from closing the modal
      >
        <button className={styles.closeButton} onClick={closeYardSign} aria-label="Close modal">
          &times;
        </button>

        <div className={styles.content}>
          <h2>Get a Yard Sign</h2>

          <YardSignForm />
        </div>
      </div>
    </div>
  );
}
