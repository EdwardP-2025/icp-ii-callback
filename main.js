import { AuthClient } from "@dfinity/auth-client";

async function run() {
  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toText();
    window.location.href = `icpapp://login?principal=${principal}`;
    return;
  }

  await authClient.login({
    identityProvider: "https://identity.ic0.app/",
    onSuccess: async () => {
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal().toText();
      window.location.href = `icpapp://login?principal=${principal}`;
    },
    onError: (err) => {
      document.body.innerHTML = `<h2 style="color:red;text-align:center;margin-top:40vh;">Login failed: ${err}</h2>`;
      console.error("II Login error:", err);
    }
  });
}

run(); 
