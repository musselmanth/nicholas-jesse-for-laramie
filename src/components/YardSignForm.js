'use client';

import { useState } from 'react';
import styles from '@/app/(main)/contact/Contact.module.css';

export default function YardSignForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    permissionToInstall: false,
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzIMRFchyYABUxkHWUt2HI_BGtBvViPhsdmRGgKQpmGDskE0tgzkMownpG8ixipkUZ12g/exec';

      // Posts to the same sheet/columns as the Get Involved form, just scoped
      // to a single "sign" interest so it lands in the same place.
      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow',
        body: JSON.stringify({
          formType: 'involved',
          name: formData.name,
          email: '',
          phone: '',
          address: formData.address,
          interests: ['sign'],
          notes: '',
          permissionToInstall: formData.permissionToInstall,
          shirtSize: '',
        }),
      });

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message);
      }

      setStatus('success');

      // Reset the form state completely after a successful submission
      setFormData({
        name: '',
        address: '',
        permissionToInstall: false,
      });

    } catch (error) {
      console.error('Submission failed:', error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>

      <div className={styles.formGroup}>
        <label htmlFor="sign-name">Name</label>
        <input
          id="sign-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="sign-address">Street Address</label>
        <input
          id="sign-address"
          type="text"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            required
            checked={formData.permissionToInstall}
            onChange={(e) => setFormData({ ...formData, permissionToInstall: e.target.checked })}
          />
          <span className={styles.checkboxCustom}></span>
          Yes, a campaign volunteer has my permission to securely place the sign in my yard for me.
        </label>
      </div>

      <button type="submit" className={styles.submitButton} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Request My Sign'}
      </button>
      {status === 'success' && (
        <div className={styles.successMessage}>
          Thanks! We&apos;ll get a yard sign out to you soon.
        </div>
      )}
    </form>
  );
}
