import { Auth } from 'aws-amplify';

export const initializeSAML = () => {
  Auth.configure({
    Auth: {
      region: 'us-east-1', // Replace with your AWS region
      userPoolId: 'us-east-1_xxxxxxxx', // Replace with your Cognito User Pool ID
      userPoolWebClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your Cognito App Client ID
      oauth: {
        domain: 'your-domain.auth.us-east-1.amazoncognito.com', // Replace with your Cognito domain
        scope: ['email', 'openid', 'profile'],
        redirectSignIn: 'http://localhost:3000/submissions', // Replace with your redirect URL
        redirectSignOut: 'http://localhost:3000/',
        responseType: 'code'
      }
    }
  });
};

export const signInWithSAML = async () => {
  try {
    await Auth.federatedSignIn();
  } catch (error) {
    console.error('Error during SAML sign-in:', error);
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    await Auth.currentAuthenticatedUser();
    return true;
  } catch {
    return false;
  }
};

export const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};