import { AuthClient } from "@dfinity/auth-client";

async function run() {
  console.log('Callback page loaded');
  
  try {
    const authClient = await AuthClient.create();
    console.log('AuthClient created');

    const urlParams = new URLSearchParams(window.location.search);
    const isLogout = urlParams.get('logout') === 'true';
    console.log('URL params:', Object.fromEntries(urlParams.entries()));
    
    if (isLogout) {
      console.log('Logout requested, clearing II session...');
      await authClient.logout();
      console.log('II session cleared, redirecting to app');
      window.location.href = 'icpapp://logout';
      return;
    }

    // Check if already authenticated first
    const isAuthenticated = await authClient.isAuthenticated();
    console.log('Is authenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      try {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toText();
        console.log('User already authenticated, redirecting to app with principal:', principal);
        window.location.href = `icpapp://login?principal=${principal}`;
        return;
      } catch (error) {
        console.error('Error getting principal from existing session:', error);
        // Continue to login flow
      }
    }

    // Start fresh login flow
    console.log('Starting Internet Identity login flow...');
    
    authClient.login({
      identityProvider: "https://identity.ic0.app/",
      onSuccess: async () => {
        console.log('II login onSuccess called');
        try {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toText();
          console.log('Login successful, redirecting to app with principal:', principal);
          
          // Force redirect to app
          setTimeout(() => {
            console.log('Executing redirect to app...');
            window.location.href = `icpapp://login?principal=${principal}`;
          }, 100);
          
        } catch (error) {
          console.error('Error in onSuccess:', error);
          // Fallback: redirect with error
          window.location.href = `icpapp://login?error=${encodeURIComponent(error.message)}`;
        }
      },
      onError: (err) => {
        console.error("II Login error:", err);
        // Redirect with error
        window.location.href = `icpapp://login?error=${encodeURIComponent(err.message)}`;
      }
    });
    
  } catch (error) {
    console.error('Error in callback page:', error);
    // Fallback redirect
    window.location.href = `icpapp://login?error=${encodeURIComponent(error.message)}`;
  }
}

run(); 
