'use client';

import { useState } from 'react';
import styles from '@/app/(main)/contact/Contact.module.css';

export default function GetInvolvedForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    interests: [],
    notes: '',
    permissionToInstall: false,
    shirtSize: ''
  });
  const [status, setStatus] = useState(null);

  const checkboxes = [
    { id: 'sign', label: 'Host a Yard Sign' },
    { id: 'canvas', label: 'Walk Neighborhoods / Canvass' },
    { id: 'postcard', label: 'Postcard Writing / Friend-banking' },
    { id: 'lit', label: 'Help Distribute Campaign Literature' },
    { id: 'parade', label: 'Participate in Parade or Event' },
  ];

  const handleCheckboxChange = (id) => {
    let updatedInterests;
    let newPermissionState = formData.permissionToInstall;

    if (formData.interests.includes(id)) {
      // User is unchecking the box
      updatedInterests = formData.interests.filter(item => item !== id);
      
      if (id === 'sign') {
        newPermissionState = false;
      }
    } else {
      updatedInterests = [...formData.interests, id];
    }

    setFormData({
      ...formData,
      interests: updatedInterests,
      permissionToInstall: newPermissionState,
      shirtSize: updatedInterests.includes('parade') ? formData.shirtSize : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzIMRFchyYABUxkHWUt2HI_BGtBvViPhsdmRGgKQpmGDskE0tgzkMownpG8ixipkUZ12g/exec';
      
      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow',
        body: JSON.stringify({ formType: 'involved', ...formData }), 
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message);
      }
      
      setStatus('success');
      
      // Reset the form state completely after a successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        interests: [],
        notes: '',
        permissionToInstall: false,
        shirtSize: ''
      });
      
    } catch (error) {
      console.error('Submission failed:', error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>


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
        <label htmlFor="vol-address">Street Address</label>
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

        {formData.interests.includes('parade') && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--brand-cream-light)',
            borderRadius: '6px',
            borderLeft: '4px solid var(--brand-orange)'
          }}>
            <label htmlFor="shirt-size" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              T-Shirt Size
            </label>
            <select
              id="shirt-size"
              value={formData.shirtSize}
              onChange={(e) => setFormData({ ...formData, shirtSize: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Select a size...</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="2XL">2XL</option>
              <option value="3XL">3XL</option>
            </select>
          </div>
        )}

        {/* Dynamic Conditional Render for the Sign Installation Permission */}
        {formData.interests.includes('sign') && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--brand-cream-light)',
            borderRadius: '6px',
            borderLeft: '4px solid var(--brand-orange)'
          }}>
            <label className={styles.checkboxLabel} style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={formData.permissionToInstall}
                onChange={(e) => setFormData({ ...formData, permissionToInstall: e.target.checked })}
              />
              <span className={styles.checkboxCustom}></span>
              Yes, a campaign volunteer has my permission to securely place the sign in my yard for me.
            </label>
          </div>
        )}
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
        {status === 'sending' ? 'Sending...' : 'Count Me In!'}
      </button>
      {status === 'success' && (
        <div className={styles.successMessage}>
          Awesome! Thanks for stepping up to help the campaign. We will be in touch soon!
        </div>
      )}
    </form>
  );
}