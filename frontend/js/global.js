function showToast(message, type = "primary") {
  alert(`[${type.toUpperCase()}] ${message}`);
}

function getStatusBadge(status) {
  const s = status.toLowerCase();
  if (s === "approved")
    return '<span class="status-badge status-approved">Approved</span>';
  if (s === "rejected")
    return '<span class="status-badge status-rejected">Rejected</span>';
  return '<span class="status-badge status-pending">Pending</span>';
}

function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function byId(id) {
  return document.getElementById(id);
}
