import { AuthClient } from "@dfinity/auth-client";

async function run() {
  const authClient = await AuthClient.create();
  await authClient.login({
    identityProvider: "https://identity.ic0.app/",
    onSuccess: async () => {
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal().toText();
      // Redirect to your app with the principal
      window.location.href = `icpapp://login?principal=${principal}`;
    }
  });
}

run(); 