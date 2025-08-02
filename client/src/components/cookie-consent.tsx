import { useState, useEffect } from 'react';
import { analytics } from '../lib/firebase';
import { Analytics, setConsent } from 'firebase/analytics';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('analytics-consent');
    
    if (hasConsent === 'true' && analytics) {
      // If user has previously accepted, apply those settings
      setConsent({
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
        security_storage: 'granted',
      });
    } else if (hasConsent === 'false' && analytics) {
      // If user has previously declined, ensure settings are denied
      setConsent({
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted', // Security is always needed
      });
    } else if (!hasConsent) {
      // Show the consent banner if no consent has been given yet
      setShowConsent(true);
    }
  }, [analytics]); // Add analytics as a dependency

  const acceptCookies = () => {
    // Set consent to granted for analytics
    if (analytics) {
      setConsent({
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',           // Added for Consent Mode v2
        ad_personalization: 'granted',     // Added for Consent Mode v2
        functionality_storage: 'granted',
        personalization_storage: 'granted',
        security_storage: 'granted',
      });
      
      // Dispatch a custom event that can be used by other scripts
      window.dispatchEvent(new CustomEvent('consentupdate', { 
        detail: { consentGranted: true } 
      }));
    }
    
    // Save consent in localStorage
    localStorage.setItem('analytics-consent', 'true');
    setShowConsent(false);
  };

  const declineCookies = () => {
    // Keep consent as denied for analytics
    if (analytics) {
      setConsent({
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',           // Added for Consent Mode v2
        ad_personalization: 'denied',     // Added for Consent Mode v2
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted', // Security is always needed
      });
      
      // Dispatch a custom event that can be used by other scripts
      window.dispatchEvent(new CustomEvent('consentupdate', { 
        detail: { consentGranted: false } 
      }));
    }
    
    // Save decision in localStorage
    localStorage.setItem('analytics-consent', 'false');
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 border-t border-gray-200">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-4">
          <p className="text-sm text-gray-700">
            We use cookies to improve your experience and analyze our traffic. By clicking "Accept",
            you consent to our use of cookies. See our Privacy Policy for more information.
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;