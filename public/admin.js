const tokenInput = document.getElementById("adminToken");
const saveTokenButton = document.getElementById("saveToken");
const loadButton = document.getElementById("loadButton");
const filterButton = document.getElementById("filterButton");
const searchInput = document.getElementById("search");
const statusFilter = document.getElementById("statusFilter");
const enquiriesContainer = document.getElementById("enquiries");
const adminMessage = document.getElementById("adminMessage");

tokenInput.value = sessionStorage.getItem("adminToken") || "";

function message(text, type = "") {
  adminMessage.textContent = text;
  adminMessage.className = `form-message ${type}`;
}

function getToken() {
  return sessionStorage.getItem("adminToken") || tokenInput.value.trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadEnquiries() {
  const token = getToken();

  if (!token) {
    message("Enter the ADMIN_TOKEN first.", "error-message");
    return;
  }

  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set("q", searchInput.value.trim());
  if (statusFilter.value) params.set("status", statusFilter.value);

  try {
    const response = await fetch(`/api/enquiries?${params.toString()}`, {
      headers: {
        "x-admin-token": token
      }
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || "Could not load enquiries.");

    renderEnquiries(result.data);
    message(`${result.data.length} enquiry/enquiries loaded.`, "success");
  } catch (error) {
    message(error.message, "error-message");
    enquiriesContainer.innerHTML = "";
  }
}

function renderEnquiries(items) {
  if (!items.length) {
    enquiriesContainer.innerHTML = `<p class="muted">No enquiries found.</p>`;
    return;
  }

  enquiriesContainer.innerHTML = items.map((item) => `
    <article class="enquiry">
      <div class="enquiry-top">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a></p>
        </div>
        <span class="badge ${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>
      </div>

      <p class="message-body">${escapeHtml(item.message)}</p>
      <small class="muted">ID: ${item.id} · ${new Date(item.createdAt).toLocaleString()}</small>

      <div class="actions">
        <select data-status-id="${item.id}">
          <option value="new" ${item.status === "new" ? "selected" : ""}>New</option>
          <option value="read" ${item.status === "read" ? "selected" : ""}>Read</option>
          <option value="resolved" ${item.status === "resolved" ? "selected" : ""}>Resolved</option>
        </select>
        <button data-update-id="${item.id}">Update Status</button>
        <button class="danger" data-delete-id="${item.id}">Delete</button>
      </div>
    </article>
  `).join("");
}

async function updateStatus(id) {
  const token = getToken();
  const select = document.querySelector(`[data-status-id="${id}"]`);

  try {
    const response = await fetch(`/api/enquiries/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token
      },
      body: JSON.stringify({ status: select.value })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Update failed.");

    await loadEnquiries();
  } catch (error) {
    message(error.message, "error-message");
  }
}

async function deleteEnquiry(id) {
  if (!confirm("Delete this enquiry?")) return;

  const token = getToken();

  try {
    const response = await fetch(`/api/enquiries/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-token": token
      }
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Delete failed.");

    await loadEnquiries();
  } catch (error) {
    message(error.message, "error-message");
  }
}

enquiriesContainer.addEventListener("click", (event) => {
  const updateButton = event.target.closest("[data-update-id]");
  const deleteButton = event.target.closest("[data-delete-id]");

  if (updateButton) updateStatus(Number(updateButton.dataset.updateId));
  if (deleteButton) deleteEnquiry(Number(deleteButton.dataset.deleteId));
});

saveTokenButton.addEventListener("click", () => {
  const token = tokenInput.value.trim();
  if (!token) return message("Token cannot be empty.", "error-message");
  sessionStorage.setItem("adminToken", token);
  message("Token saved for this browser session.", "success");
  loadEnquiries();
});

loadButton.addEventListener("click", loadEnquiries);
filterButton.addEventListener("click", loadEnquiries);

loadEnquiries();