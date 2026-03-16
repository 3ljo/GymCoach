// Google OAuth Configuration (for production)
// IMPORTANT: You need to add your own Google OAuth credentials
// Get them from: https://console.cloud.google.com/
// Uncomment when ready:
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// WebBrowser.maybeCompleteAuthSession();

// export const useGoogleAuth = () => {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
//     iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
//     androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
//   });
//   return { request, response, promptAsync };
// };

// Mock authentication for development (works immediately without OAuth setup)
export const mockSocialAuth = (provider) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        provider,
        user: {
          id: `mock_${provider}_${Date.now()}`,
          email: `user@${provider}.com`,
          name: `Test User (${provider})`,
          avatar: null,
        }
      });
    }, 1000);
  });
};
