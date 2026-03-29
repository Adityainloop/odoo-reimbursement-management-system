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
