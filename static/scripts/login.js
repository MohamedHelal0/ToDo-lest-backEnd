// const { date } = require("joi");

function validateEmail(event) {
  event.preventDefault();

  var email = document.getElementById("username").value;
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    document.getElementById("message").innerText =
      "البريد الإلكتروني غير صحيح. الرجاء المحاولة مرة أخرى.";
    return;
  }

  submitForm();
}

function submitForm() {
  const formData = new FormData(form);
  const jsonData = {};

  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  fetch(window.location.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status == 400) {
          document.getElementById("invalid").innerHTML =
            "Inveled Email or password";
        }
      }

      return response.json();
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}
const form = document.getElementById("login");
form.addEventListener("submit", validateEmail);
