<<<<<<< HEAD
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
=======
const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");

    if (role !== "manager") {
        alert("Access denied. Manager only.");
        window.location.href = "login.html";
        return;
    }

    loadPendingExpenses();
});

async function loadPendingExpenses() {
    const tbody = document.getElementById("pendingTableBody");

    if (!tbody) return;

    try {
        const response = await fetch(`${API_BASE_URL}/expenses/pending`);
        const expenses = await response.json();

        if (!response.ok) {
            throw new Error(expenses.detail || "Failed to load pending expenses");
        }

        tbody.innerHTML = "";

        if (expenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted">No pending expenses</td>
                </tr>
            `;
            updateManagerStats(0, 0);
            return;
        }

        expenses.forEach((expense) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.expense_id}</td>
                <td>${expense.employee_name || expense.employee_id || "-"}</td>
                <td>₹${Number(expense.amount).toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.created_at ? formatDate(expense.created_at) : "-"}</td>
                <td>${expense.description || "-"}</td>
                <td><span class="badge bg-warning text-dark">Pending</span></td>
                <td>
                    <div class="d-flex flex-column gap-2">
                        <input 
                            type="text" 
                            class="form-control form-control-sm" 
                            id="comment-${expense.expense_id}" 
                            placeholder="Optional comment"
                        >
                        <div class="d-flex gap-2">
                            <button class="btn btn-success btn-sm" onclick="approveExpense(${expense.expense_id})">
                                Approve
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="rejectExpense(${expense.expense_id})">
                                Reject
                            </button>
                        </div>
                    </div>
                </td>
            `;

            tbody.appendChild(row);
        });

        updateManagerStats(expenses.length, 0);

    } catch (error) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger">${error.message}</td>
            </tr>
        `;
    }
}

function updateManagerStats(pendingCount, reviewedTodayCount) {
    const pendingEl = document.getElementById("pendingReviewCount");
    const reviewedEl = document.getElementById("reviewedTodayCount");

    if (pendingEl) pendingEl.textContent = pendingCount;
    if (reviewedEl) reviewedEl.textContent = reviewedTodayCount;
}

async function approveExpense(expenseId) {
    const managerId = parseInt(localStorage.getItem("user_id"));
    const comment = document.getElementById(`comment-${expenseId}`)?.value.trim() || null;

    try {
        const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}/approve`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                manager_id: managerId,
                comment: comment
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to approve expense");
        }

        alert(`Expense #${expenseId} approved`);
        loadPendingExpenses();

    } catch (error) {
        alert(error.message);
    }
}

async function rejectExpense(expenseId) {
    const managerId = parseInt(localStorage.getItem("user_id"));
    const comment = document.getElementById(`comment-${expenseId}`)?.value.trim() || null;

    try {
        const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}/reject`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                manager_id: managerId,
                comment: comment
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to reject expense");
        }

        alert(`Expense #${expenseId} rejected`);
        loadPendingExpenses();

    } catch (error) {
        alert(error.message);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}
>>>>>>> 49869ab (protype with backend)
