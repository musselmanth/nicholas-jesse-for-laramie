'use client';

import { useState } from 'react';
import styles from '@/app/contact/Contact.module.css';

export default function GeneralContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Replace with your actual deployed Apps Script URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzIMRFchyYABUxkHWUt2HI_BGtBvViPhsdmRGgKQpmGDskE0tgzkMownpG8ixipkUZ12g/exec';
      
      const response = await fetch(scriptURL, {
        method: 'POST',
        // Apps Script prefers text/plain to avoid triggering CORS preflight checks
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow',
        body: JSON.stringify({ formType: 'message', ...formData }), // Change to 'involved' for the other form
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message);
      }
      
      setStatus('success');
      // Reset your form state here...
    } catch (error) {
      console.error('Submission failed:', error);
      setStatus('error');
    }
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