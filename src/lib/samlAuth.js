import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID",
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: "http://localhost:3000/submissions",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export const initializeSAML = async () => {
  await msalInstance.initialize();
};

export const signInWithSAML = async () => {
  try {
    const loginResponse = await msalInstance.loginPopup({
      scopes: ["user.read"],
      prompt: "select_account",
    });
    return loginResponse.account;
  } catch (error) {
    console.error("Error during MS365 sign-in:", error);
    throw error;
  }
};

export const checkAuthStatus = async () => {
  const currentAccounts = msalInstance.getAllAccounts();
  if (currentAccounts.length > 0) {
    return true;
  }
  return false;
};

export const signOut = async () => {
  try {
    await msalInstance.logoutPopup();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
