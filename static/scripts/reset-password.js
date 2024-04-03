document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var messageElement = document.getElementById("message");

    // Clear any previous messages
    messageElement.innerHTML = "";

    if (password !== confirmPassword) {
      // If passwords do not match, display error message
      messageElement.textContent = "Passwords do not match!";
      messageElement.style.color = "red";
    } else {
      const data = { password };

      // Make a POST request using Fetch API
      fetch(window.location.href, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          if (response.ok) {
            window.location.href = "/auth/login";
          }
          console.log(response);
          return response.text(); // or response.json() if expecting JSON data
        })
        .then((data) => {
          console.log("Email sent successfully:", data);
          // Optionally, display a success message or redirect the user
        })
        .catch((error) => {
          console.error("There was a problem sending the email:", error);
          // Optionally, display an error message to the user
        });

      // messageElement.textContent = "Password reset successfully!";
      // messageElement.style.color = "green";
    }
  });
