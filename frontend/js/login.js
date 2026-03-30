<<<<<<< HEAD
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
=======
const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value.trim();
        const messageBox = document.getElementById("loginMessage");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Login failed");
            }

            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("full_name", data.full_name);
            localStorage.setItem("email", data.email);
            localStorage.setItem("role", data.role);
            localStorage.setItem("company_id", data.company_id);

            if (messageBox) {
                messageBox.textContent = "Login successful!";
                messageBox.className = "alert alert-success mt-3";
            } else {
                alert("Login successful!");
            }

            setTimeout(() => {
                if (data.role === "employee") {
                    window.location.href = "employee-dashboard.html";
                } else if (data.role === "manager") {
                    window.location.href = "manager-dashboard.html";
                } else if (data.role === "admin") {
                    window.location.href = "admin-dashboard.html";
                } else {
                    alert("Unknown role");
                }
            }, 800);

        } catch (error) {
            if (messageBox) {
                messageBox.textContent = error.message;
                messageBox.className = "alert alert-danger mt-3";
            } else {
                alert(error.message);
            }
        }
    });
});
>>>>>>> 49869ab (protype with backend)
