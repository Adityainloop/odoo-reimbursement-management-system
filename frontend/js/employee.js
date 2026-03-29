document.addEventListener("DOMContentLoaded", () => {
  const tableBody = byId("expenseTableBody");
  const ocrBtn = byId("ocrBtn");
  const submitBtn = byId("submitExpenseBtn");

  const expenses = [
    {
      id: 1,
      amount: 1200,
      currency: "INR",
      category: "Travel",
      date: "2026-03-20",
      status: "Pending",
    },
    {
      id: 2,
      amount: 850,
      currency: "INR",
      category: "Food",
      date: "2026-03-18",
      status: "Approved",
    },
    {
      id: 3,
      amount: 450,
      currency: "INR",
      category: "Supplies",
      date: "2026-03-16",
      status: "Rejected",
    },
  ];

  function renderExpenses() {
    tableBody.innerHTML = expenses
      .map(
        (exp) => `
      <tr>
        <td>#${exp.id}</td>
        <td>${formatCurrency(exp.amount, exp.currency)}</td>
        <td>${exp.category}</td>
        <td>${exp.date}</td>
        <td>${getStatusBadge(exp.status)}</td>
      </tr>
    `,
      )
      .join("");
  }

  ocrBtn?.addEventListener("click", () => {
    byId("amount").value = "1299";
    byId("category").value = "Travel";
    byId("description").value = "Auto-filled from OCR demo receipt";
    byId("expenseDate").value = "2026-03-29";
    showToast("OCR demo filled sample data", "success");
  });

  submitBtn?.addEventListener("click", () => {
    const amount = byId("amount").value;
    const category = byId("category").value;
    const expenseDate = byId("expenseDate").value;

    if (!amount || !category || !expenseDate) {
      showToast("Please fill required fields", "danger");
      return;
    }

    expenses.unshift({
      id: expenses.length + 1,
      amount: Number(amount),
      currency: "INR",
      category,
      date: expenseDate,
      status: "Pending",
    });

    renderExpenses();
    showToast("Expense submitted (demo)", "success");
  });

  renderExpenses();
});
