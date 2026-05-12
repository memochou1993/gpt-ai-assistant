import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../auth/msalConfig.js';
import './LoginPage.css';

export default function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(console.error);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🎙️</div>
        <h1 className="login-title">English Speaking Coach</h1>
        <p className="login-subtitle">
          AI-powered pronunciation and grammar feedback.<br />
          Sign in with your organization account to get started.
        </p>
        <button className="btn-ms-login" onClick={handleLogin}>
          <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
}
