document.addEventListener("DOMContentLoaded", () => {
  const tbody = byId("pendingTableBody");

  const pending = [
    {
      id: 101,
      employee: "Rahul",
      amount: 2200,
      category: "Travel",
      date: "2026-03-28",
      status: "Pending",
    },
    {
      id: 102,
      employee: "Priya",
      amount: 900,
      category: "Food",
      date: "2026-03-27",
      status: "Pending",
    },
  ];

  function render() {
    tbody.innerHTML = pending
      .map(
        (item) => `
      <tr>
        <td>#${item.id}</td>
        <td>${item.employee}</td>
        <td>${formatCurrency(item.amount, "INR")}</td>
        <td>${item.category}</td>
        <td>${item.date}</td>
        <td>${getStatusBadge(item.status)}</td>
        <td>
          <button class="btn btn-sm btn-success" onclick="approveExpense(${item.id})">Approve</button>
          <button class="btn btn-sm btn-danger" onclick="rejectExpense(${item.id})">Reject</button>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  window.approveExpense = (id) => {
    const item = pending.find((x) => x.id === id);
    if (item) item.status = "Approved";
    render();
    showToast(`Expense #${id} approved`, "success");
  };

  window.rejectExpense = (id) => {
    const item = pending.find((x) => x.id === id);
    if (item) item.status = "Rejected";
    render();
    showToast(`Expense #${id} rejected`, "danger");
  };

  render();
});
