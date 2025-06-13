import React from 'react';
import ReactDOM from 'react-dom/client';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import './index.css';
import App from './App';
const msalConfig = {
  auth: {
    clientId: "2aec9409-6098-4855-a5f3-3aed80120cd7",      // ✅ Replace this!
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:3000" // ✅ or your redirect URL
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
