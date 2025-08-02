// Import the functions you need from the SDKs you need 
import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics, setConsent, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { 
  apiKey: "AIzaSyA738Tzl4qvn3DAzOCLNUXJS-7vOiNI7xM", 
  authDomain: "mother-grid.firebaseapp.com", 
  projectId: "mother-grid", 
  storageBucket: "mother-grid.firebasestorage.app", 
  messagingSenderId: "450809459793", 
  appId: "1:450809459793:web:0199c0e49e908eb5be7470", 
  measurementId: "G-FB1CH3L0FF" 
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics with modified settings to address cookie consent issues
let analytics: Analytics | null = null;

const initializeAnalytics = async () => {
  try {
    // Check if analytics is supported in this environment
    const supported = await isSupported();
    
    // Only initialize analytics in browser environment and if not in an iframe
    if (typeof window !== 'undefined' && window.self === window.top && supported) {
      // Configure analytics with more privacy-friendly settings
      analytics = getAnalytics(app);
      
      // Set default consent to "denied" until user provides consent
      // This helps with the third-party cookie warnings and addresses ERR_ABORTED issues
      setConsent({
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",           // Added for Consent Mode v2
        ad_personalization: "denied",     // Added for Consent Mode v2
        functionality_storage: "denied",
        personalization_storage: "denied",
        security_storage: "granted", // Security is always needed
      });
      
      // Add event listener for consent changes from browser settings
      window.addEventListener('consentupdate', (event) => {
        const customEvent = event as CustomEvent<{consentGranted: boolean}>;
        if (customEvent.detail && analytics) {
          const consentStatus = customEvent.detail.consentGranted ? 'granted' : 'denied';
          setConsent({
            analytics_storage: consentStatus,
            ad_storage: consentStatus,
            ad_user_data: consentStatus,
            ad_personalization: consentStatus,
            functionality_storage: consentStatus,
            personalization_storage: consentStatus,
            security_storage: 'granted',
          });
        }
      });
      
      // Check for stored consent
      const storedConsent = localStorage.getItem('analytics-consent');
      if (storedConsent === 'true') {
        setConsent({
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          functionality_storage: 'granted',
          personalization_storage: 'granted',
          security_storage: 'granted',
        });
      }
      
      console.log("Firebase Analytics initialized with enhanced privacy settings");
    }
  } catch (error) {
    console.error("Error initializing Firebase Analytics:", error);
  }
};

// Initialize analytics
initializeAnalytics();

export { app, analytics };