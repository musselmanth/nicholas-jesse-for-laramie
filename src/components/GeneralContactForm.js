'use client';

import { useState } from 'react';
import styles from '@/app/contact/Contact.module.css';

export default function GeneralContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Placeholder for your Google Workspace / Sheets endpoint
    setTimeout(() => {
      console.log('General Contact Submission:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {status === 'success' && (
        <div className={styles.successMessage}>
          Thank you for reaching out! We will get back to you as soon as possible.
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="gen-name">Name</label>
        <input
          id="gen-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="gen-email">Email Address</label>
        <input
          id="gen-email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="gen-phone">Phone Number (Optional)</label>
        <input
          id="gen-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="gen-message">Message</label>
        <textarea
          id="gen-message"
          rows="5"
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}