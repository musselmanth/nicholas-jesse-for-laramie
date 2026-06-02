'use client';

import { useGetInvolved } from '@/context/GetInvolvedContext';
import GetInvolvedForm from './GetInvolvedForm';
import styles from './Modal.module.css'; 

export default function GetInvolvedModal() {
  const { isOpen, closeGetInvolved } = useGetInvolved();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeGetInvolved}>
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the form from closing the modal
      >
        <button className={styles.closeButton} onClick={closeGetInvolved} aria-label="Close modal">
          &times;
        </button>
        
        <div className={styles.content}>
          <h2>Get Involved</h2>
          
          {/* The form component we built earlier */}
          <GetInvolvedForm />
        </div>
      </div>
    </div>
  );
}