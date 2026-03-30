<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
  const usersBody = byId("usersTableBody");
  const workflowList = byId("workflowList");
  const addUserBtn = byId("addUserBtn");
  const addStepBtn = byId("addStepBtn");

  const users = [
    { name: "Arjun", role: "Admin", manager: "-" },
    { name: "Rahul", role: "Manager", manager: "-" },
    { name: "Priya", role: "Employee", manager: "Rahul" },
  ];

  const steps = ["Manager", "Finance", "Director"];

  function renderUsers() {
    usersBody.innerHTML = users
      .map(
        (user) => `
      <tr>
        <td>${user.name}</td>
        <td>${user.role}</td>
        <td>${user.manager}</td>
      </tr>
    `,
      )
      .join("");
  }

  function renderSteps() {
    workflowList.innerHTML = steps
      .map(
        (step, index) => `
      <div class="workflow-step mb-2">Step ${index + 1}: ${step}</div>
    `,
      )
      .join("");
  }

  addUserBtn?.addEventListener("click", () => {
    users.push({ name: "New User", role: "Employee", manager: "Rahul" });
    renderUsers();
    showToast("Demo user added", "success");
  });

  addStepBtn?.addEventListener("click", () => {
    steps.push(`Approver ${steps.length + 1}`);
    renderSteps();
    showToast("Workflow step added", "primary");
  });

  renderUsers();
  renderSteps();
});
=======
const API_BASE = window.API_BASE || "http://127.0.0.1:8000";

const usersTableBody = document.getElementById("usersTableBody");
const employeeCount = document.getElementById("employeeCount");
const managerCount = document.getElementById("managerCount");
const pendingExpenseCount = document.getElementById("pendingExpenseCount");
const addUserBtn = document.getElementById("addUserBtn");

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
    addUserBtn.addEventListener("click", addDemoUser);
});

async function loadDashboard() {
    try {
        const [usersRes, expensesRes] = await Promise.all([
            fetch(`${API_BASE}/admin/users`),
            fetch(`${API_BASE}/expenses`),
        ]);

        const users = await usersRes.json();
        const expenses = await expensesRes.json();

        renderStats(users, expenses);
        renderUsers(users);
    } catch (error) {
        console.error("Error loading admin dashboard:", error);
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-danger text-center">
                    Failed to load dashboard data.
                </td>
            </tr>
        `;
    }
}

function renderStats(users, expenses) {
    const employees = users.filter((u) => u.role === "employee");
    const managers = users.filter((u) => u.role === "manager");
    const pendingExpenses = expenses.filter((e) => e.status === "pending");

    employeeCount.textContent = employees.length;
    managerCount.textContent = managers.length;
    pendingExpenseCount.textContent = pendingExpenses.length;
}

function renderUsers(users) {
    if (!users.length) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">No users found.</td>
            </tr>
        `;
        return;
    }

    const managerOptions = users
        .filter((u) => u.role === "manager")
        .map((m) => `<option value="${m.id}">${m.name}</option>`)
        .join("");

    usersTableBody.innerHTML = users
        .map((user) => {
            const managerName = user.reporting_manager
                ? user.reporting_manager.name
                : "—";

            const managerSelect =
                user.role === "employee"
                    ? `
                        <select class="form-select form-select-sm manager-select" data-user-id="${user.id}">
                            <option value="">No Manager</option>
                            ${users
                                .filter((u) => u.role === "manager")
                                .map(
                                    (m) => `
                                    <option value="${m.id}" ${user.reporting_manager_id === m.id ? "selected" : ""}>
                                        ${m.name}
                                    </option>
                                `
                                )
                                .join("")}
                        </select>
                    `
                    : `<span class="text-muted">—</span>`;

            return `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <select class="form-select form-select-sm role-select" data-user-id="${user.id}">
                            <option value="employee" ${user.role === "employee" ? "selected" : ""}>Employee</option>
                            <option value="manager" ${user.role === "manager" ? "selected" : ""}>Manager</option>
                            <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                        </select>
                    </td>
                    <td>${managerSelect}</td>
                </tr>
            `;
        })
        .join("");

    attachRoleListeners();
    attachManagerListeners();
}

function attachRoleListeners() {
    const roleSelects = document.querySelectorAll(".role-select");

    roleSelects.forEach((select) => {
        select.addEventListener("change", async (e) => {
            const userId = e.target.dataset.userId;
            const newRole = e.target.value;

            try {
                const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ role: newRole }),
                });

                if (!res.ok) throw new Error("Failed to update role");

                await loadDashboard();
            } catch (error) {
                console.error(error);
                alert("Could not update role.");
            }
        });
    });
}

function attachManagerListeners() {
    const managerSelects = document.querySelectorAll(".manager-select");

    managerSelects.forEach((select) => {
        select.addEventListener("change", async (e) => {
            const userId = e.target.dataset.userId;
            const managerId = e.target.value || null;

            try {
                const res = await fetch(`${API_BASE}/admin/users/${userId}/manager`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reporting_manager_id: managerId ? Number(managerId) : null,
                    }),
                });

                if (!res.ok) throw new Error("Failed to update manager");

                await loadDashboard();
            } catch (error) {
                console.error(error);
                alert("Could not update reporting manager.");
            }
        });
    });
}

async function addDemoUser() {
    const timestamp = Date.now();

    const demoUser = {
        name: `Demo User ${timestamp.toString().slice(-4)}`,
        email: `demo${timestamp}@example.com`,
        role: "employee",
        company_id: 1,
        reporting_manager_id: null,
    };

    try {
        const res = await fetch(`${API_BASE}/admin/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(demoUser),
        });

        if (!res.ok) throw new Error("Failed to create user");

        await loadDashboard();
    } catch (error) {
        console.error(error);
        alert("Could not create demo user.");
    }
}
>>>>>>> 49869ab (protype with backend)
