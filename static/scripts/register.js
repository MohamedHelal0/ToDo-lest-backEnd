// Get form and input elements
const form = document.getElementById("register");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");

// Validate form input on form submit
const validateForm = (event) => {
  event.preventDefault();

  if (
    username.value.toLowerCase() === "admin" ||
    email.value.toLowerCase() === "admin@example.com"
  ) {
    console.error("This data is restricted, please enter new data.");
    return;
  }

  if (
    password.value.length < 8 ||
    !/[a-z]/.test(password.value) ||
    !/[A-Z]/.test(password.value) ||
    !/[0-9]/.test(password.value) ||
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password.value)
  ) {
    console.error(
      "Password must be at least 8 characters long, containing at least one lowercase, one uppercase, one number, and one special character."
    );
    return;
  }

  // If form input is valid, submit form data
  submitForm(event);
};
form.addEventListener("submit", validateForm);

// Submit form data to server
const submitForm = (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const jsonData = {};

  // Convert form data to JSON format
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  // Send JSON data to server
  fetch(window.location.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("An error occurred while creating the account.");
      }

      return response.json();
    })

    .then((data) => {
      // Save token to local storage and redirect to homepage
      localStorage.setItem("token", data.token);
    })
    .then(() => {
      window.location.href = "/";
    })

    .catch((error) => {
      console.error("Error:", error.message);
    });
};
