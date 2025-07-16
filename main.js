import { AuthClient } from "@dfinity/auth-client";

async function run() {
  const authClient = await AuthClient.create();

  const urlParams = new URLSearchParams(window.location.search);
  const isLogout = urlParams.get('logout') === 'true';
  
  if (isLogout) {
    console.log('Logout requested, clearing II session...');
    await authClient.logout();
    console.log('II session cleared, redirecting to app');
    window.location.href = 'icpapp://logout';
    return;
  }

  if (await authClient.isAuthenticated()) {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toText();
    console.log('User already authenticated, redirecting to app with principal:', principal);
    window.location.href = `icpapp://login?principal=${principal}`;
    return;
  }

  console.log('Starting Internet Identity login flow...');
  
  await authClient.login({
    identityProvider: "https://identity.ic0.app/",
    onSuccess: async () => {
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal().toText();
      console.log('Login successful, redirecting to app with principal:', principal);
      window.location.href = `icpapp://login?principal=${principal}`;
    },
    onError: (err) => {
      document.body.innerHTML = `<h2 style="color:red;text-align:center;margin-top:40vh;">Login failed: ${err}</h2>`;
      console.error("II Login error:", err);
    }
  });
}

run(); 
