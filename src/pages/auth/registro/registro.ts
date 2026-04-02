import { ROUTES } from "../../../utils/navigate.js";
import {
  ensureSeedAdmin,
  getSession,
  redirectAfterAuth,
  register,
} from "../../../utils/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  await ensureSeedAdmin();

  const existing = getSession();
  if (existing !== null) {
    redirectAfterAuth(existing.rol);
    return;
  }

  const form = document.getElementById("form-registro") as HTMLFormElement | null;
  const msg = document.getElementById("form-message");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const confirm = (
      document.getElementById("confirm") as HTMLInputElement
    ).value;

    const result = await register(email, password, confirm);
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

  const toLogin = document.getElementById("link-login");
  if (toLogin) {
    toLogin.setAttribute("href", ROUTES.login);
  }
});
