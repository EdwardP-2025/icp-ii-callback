import { AuthClient } from "@dfinity/auth-client";

async function run() {
  const authClient = await AuthClient.create();
  if (await authClient.isAuthenticated()) {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toText();
    window.location.href = `icpapp://login?principal=${principal}`;
  } else {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toText();
        window.location.href = `icpapp://login?principal=${principal}`;
      }
    });
  }
}

run(); 
