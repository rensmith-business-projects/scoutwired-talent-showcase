import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: process.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: process.env.VITE_REDIRECT_URI || "http://localhost:5173/auth-redirect",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"]
};

export const msalInstance = new PublicClientApplication(msalConfig);