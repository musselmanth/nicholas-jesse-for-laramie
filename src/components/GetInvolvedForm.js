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
    { id: 'phone', label: 'Make Phone Calls' },
    { id: 'event', label: 'Host a Meet & Greet Event' },
    { id: 'lit', label: 'Help Distribute Campaign Literature' },
  ];

  const handleCheckboxChange = (id) => {
    const updatedInterests = formData.interests.includes(id)
      ? formData.interests.filter(item => item !== id)
      : [...formData.interests, id];
    setFormData({ ...formData, interests: updatedInterests });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    setTimeout(() => {
      console.log('Get Involved Submission:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', address: '', interests: [], notes: '' });
    }, 1000);
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
        <label htmlFor="vol-address">Street Address (For Ward Verification & Signs)</label>
        <input
          id="vol-address"
          type="text"
          required
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
        <label htmlFor="vol-notes">Other ideas or skills you want to share?</label>
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