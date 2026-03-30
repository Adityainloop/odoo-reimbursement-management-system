<<<<<<< HEAD
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
=======
const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("user_id");
    const companyId = localStorage.getItem("company_id");

    if (role !== "employee") {
        alert("Access denied. Employee only.");
        window.location.href = "login.html";
        return;
    }

    loadExpenseHistory();

    const submitBtn = document.getElementById("submitExpenseBtn");
    if (submitBtn) {
        submitBtn.addEventListener("click", submitExpense);
    }

    const ocrBtn = document.getElementById("ocrBtn");
    if (ocrBtn) {
        ocrBtn.addEventListener("click", autoFillDemo);
    }
});

async function submitExpense() {
    const userId = localStorage.getItem("user_id");
    const companyId = localStorage.getItem("company_id");

    const amount = parseFloat(document.getElementById("amount")?.value);
    const category = document.getElementById("category")?.value.trim();
    const expenseDate = document.getElementById("expenseDate")?.value;
    const description = document.getElementById("description")?.value.trim();

    if (!amount || !category || !expenseDate) {
        alert("Please fill amount, category, and date.");
        return;
    }

    const payload = {
        title: `${category} Expense - ${expenseDate}`,
        amount: amount,
        category: category,
        description: description || `Expense submitted on ${expenseDate}`,
        receipt_path: null,
        employee_id: parseInt(userId),
        company_id: parseInt(companyId)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/expenses/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to submit expense");
        }

        alert("Expense submitted successfully!");
        clearExpenseForm();
        loadExpenseHistory();

    } catch (error) {
        alert(error.message);
    }
}

async function loadExpenseHistory() {
    const userId = localStorage.getItem("user_id");
    const tbody = document.getElementById("expenseTableBody");

    if (!tbody) return;

    try {
        const response = await fetch(`${API_BASE_URL}/expenses/user/${userId}`);
        const expenses = await response.json();

        if (!response.ok) {
            throw new Error(expenses.detail || "Failed to load expenses");
        }

        tbody.innerHTML = "";

        let pending = 0;
        let approved = 0;
        let rejected = 0;

        if (expenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">No expenses found</td>
                </tr>
            `;
            updateStats(0, 0, 0);
            return;
        }

        expenses.forEach((expense) => {
            if (expense.status === "pending") pending++;
            if (expense.status === "approved") approved++;
            if (expense.status === "rejected") rejected++;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.expense_id}</td>
                <td>₹${Number(expense.amount).toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.created_at ? formatDate(expense.created_at) : "-"}</td>
                <td>${renderStatusBadge(expense.status)}</td>
                <td>${expense.manager_comment || "-"}</td>
                <td>${expense.reviewed_at ? formatDate(expense.reviewed_at) : "-"}</td>
            `;

            tbody.appendChild(row);
        });

        updateStats(pending, approved, rejected);

    } catch (error) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">${error.message}</td>
            </tr>
        `;
    }
}

function updateStats(pending, approved, rejected) {
    const pendingEl = document.getElementById("pendingCount");
    const approvedEl = document.getElementById("approvedCount");
    const rejectedEl = document.getElementById("rejectedCount");

    if (pendingEl) pendingEl.textContent = pending;
    if (approvedEl) approvedEl.textContent = approved;
    if (rejectedEl) rejectedEl.textContent = rejected;
}

function autoFillDemo() {
    const amountEl = document.getElementById("amount");
    const categoryEl = document.getElementById("category");
    const expenseDateEl = document.getElementById("expenseDate");
    const descriptionEl = document.getElementById("description");

    if (amountEl) amountEl.value = "850";
    if (categoryEl) categoryEl.value = "Travel";
    if (expenseDateEl) expenseDateEl.value = new Date().toISOString().split("T")[0];
    if (descriptionEl) descriptionEl.value = "Auto-filled from OCR demo receipt";

    alert("OCR demo auto-filled!");
}

function clearExpenseForm() {
    const amountEl = document.getElementById("amount");
    const categoryEl = document.getElementById("category");
    const expenseDateEl = document.getElementById("expenseDate");
    const descriptionEl = document.getElementById("description");

    if (amountEl) amountEl.value = "";
    if (categoryEl) categoryEl.value = "";
    if (expenseDateEl) expenseDateEl.value = "";
    if (descriptionEl) descriptionEl.value = "";
}

function renderStatusBadge(status) {
    if (status === "approved") {
        return `<span class="badge bg-success">Approved</span>`;
    }
    if (status === "rejected") {
        return `<span class="badge bg-danger">Rejected</span>`;
    }
    return `<span class="badge bg-warning text-dark">Pending</span>`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}
>>>>>>> 49869ab (protype with backend)
