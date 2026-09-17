const form = document.getElementById("contactForm");
const button = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");

function setError(field, message) {
  document.getElementById(`${field}Error`).textContent = message || "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  ["name", "email", "message"].forEach((field) => setError(field, ""));
  formMessage.textContent = "";
  formMessage.className = "form-message";

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim()
  };

  button.disabled = true;
  button.textContent = "Sending...";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, message]) => {
          setError(field, message);
        });
      }
      throw new Error(result.message || "Submission failed.");
    }

    form.reset();
    formMessage.textContent = result.message;
    formMessage.className = "form-message success";
  } catch (error) {
    formMessage.textContent = error.message || "Something went wrong.";
    formMessage.className = "form-message error-message";
  } finally {
    button.disabled = false;
    button.textContent = "Send Enquiry";
  }
});