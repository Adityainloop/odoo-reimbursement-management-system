document.addEventListener("DOMContentLoaded", () => {
  const form = byId("loginForm");
  const roleSelect = byId("roleSelect");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const role = roleSelect.value;

    if (role === "employee") {
      window.location.href = "employee-dashboard.html";
    } else if (role === "manager") {
      window.location.href = "manager-dashboard.html";
    } else {
      window.location.href = "admin-dashboard.html";
    }
  });
});
