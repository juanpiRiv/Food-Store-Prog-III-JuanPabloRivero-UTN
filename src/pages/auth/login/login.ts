import {
  ensureSeedAdmin,
  getSession,
  login,
  redirectAfterAuth,
} from "../../../utils/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  await ensureSeedAdmin();

  const existing = getSession();
  if (existing !== null) {
    redirectAfterAuth(existing.rol);
    return;
  }

  const form = document.getElementById("form-login") as HTMLFormElement | null;
  const msg = document.getElementById("form-message");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    const result = await login(email, password);
    if (!result.ok) {
      if (msg) {
        msg.textContent = result.message;
        msg.hidden = false;
      }
      return;
    }

    const session = getSession();
    if (session !== null) {
      redirectAfterAuth(session.rol);
    }
  });
});
