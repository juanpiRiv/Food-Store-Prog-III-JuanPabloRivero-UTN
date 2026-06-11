import { ROUTES, navigate } from "../../../utils/navigate.js";
import { checkAuthUser } from "../../../utils/auth.js";

// Redirige al nuevo dashboard del panel admin
document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuthUser(ROUTES.login, ROUTES.clientHome, "admin")) return;
  navigate(ROUTES.adminDashboard);
});
