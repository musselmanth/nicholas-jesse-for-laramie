'use client';

import { useState } from 'react';
import styles from '@/app/contact/Contact.module.css';

export default function GetInvolvedForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    interests: [],
    notes: ''
  });
  const [status, setStatus] = useState(null);

  const checkboxes = [
    { id: 'sign', label: 'Host a Yard Sign' },
    { id: 'canvas', label: 'Walk Neighborhoods / Canvass' },
    { id: 'event', label: 'Postcard Writing / Friend-banking' },
    { id: 'lit', label: 'Help Distribute Campaign Literature' },
    { id: 'parade', label: 'Participate in Parade or Event' },
  ];

  const handleCheckboxChange = (id) => {
    const updatedInterests = formData.interests.includes(id)
      ? formData.interests.filter(item => item !== id)
      : [...formData.interests, id];
    setFormData({ ...formData, interests: updatedInterests });
  };

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
        body: JSON.stringify({ formType: 'involved', ...formData }), // Change to 'involved' for the other form
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
          Awesome! Thanks for stepping up to help the campaign. We will be in touch soon!
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="vol-name">Name</label>
        <input
          id="vol-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className={styles.formGroupRow}>
        <div className={styles.formGroup}>
          <label htmlFor="vol-email">Email Address</label>
          <input
            id="vol-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="vol-phone">Phone Number</label>
          <input
            id="vol-phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="vol-address">Street Address (Optional—for Yard Sign Delivery)</label>
        <input
          id="vol-address"
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxGroupHeading}>How would you like to help?</label>
        <div className={styles.checkboxGrid}>
          {checkboxes.map((box) => (
            <label key={box.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.interests.includes(box.id)}
                onChange={() => handleCheckboxChange(box.id)}
              />
              <span className={styles.checkboxCustom}></span>
              {box.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="vol-notes">Anything else you want to share?</label>
        <textarea
          id="vol-notes"
          rows="3"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={status === 'sending'}>
        {status === 'sending' ? 'Joining...' : 'Count Me In!'}
      </button>
    </form>
  );
}