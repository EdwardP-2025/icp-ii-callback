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

    // Always force logout before starting a new login
    console.log('Forcing II logout before login...');
    await authClient.logout();
    console.log('II session cleared, starting fresh login flow...');

    // Start fresh login flow
    authClient.login({
      identityProvider: "https://identity.ic0.app/",
      onSuccess: async () => {
        console.log('II login onSuccess called');
        try {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toText();
          console.log('Login successful, redirecting to app with principal:', principal);
          setTimeout(() => {
            console.log('Executing redirect to app...');
            window.location.href = `icpapp://login?principal=${principal}`;
          }, 100);
        } catch (error) {
          console.error('Error in onSuccess:', error);
          window.location.href = `icpapp://login?error=${encodeURIComponent(error.message)}`;
        }
      },
      onError: (err) => {
        console.error("II Login error:", err);
        window.location.href = `icpapp://login?error=${encodeURIComponent(err.message)}`;
      }
    });
    
  } catch (error) {
    console.error('Error in callback page:', error);
    window.location.href = `icpapp://login?error=${encodeURIComponent(error.message)}`;
  }
}

run(); 
