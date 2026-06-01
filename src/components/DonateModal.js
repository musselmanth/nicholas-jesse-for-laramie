'use client';

import { useEffect } from 'react';
import { useDonate } from '@/context/DonateContext';
import styles from './DonateModal.module.css';

export default function DonateModal() {
  const { isOpen, closeDonate } = useDonate();

useEffect(() => {
    if (isOpen) {
      if (!document.getElementById('donorbox-widget-script')) {
        const script = document.createElement('script');
        script.id = 'donorbox-widget-script'; // Give it an ID we can check for
        script.src = "https://donorbox.org/widgets.js";
        script.type = "module";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeDonate}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <button 
          className={styles.closeButton} 
          onClick={closeDonate}
          aria-label="Close donation form"
        >
          &times;
        </button>
        
        <div className={styles.content}>
          <h2>Support the Campaign</h2>
          
          {/* Using dangerouslySetInnerHTML forces the browser to handle the attributes, preventing the React DOM error */}
          <div dangerouslySetInnerHTML={{ 
            __html: '<dbox-widget campaign="nicholas-jesse-for-laramie" type="donation_form" enable-auto-scroll="true"></dbox-widget>' 
          }} />
          
        </div>
      </div>
    </div>
  );
}