document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    var messageElement = document.getElementById("message")
    const data = { email };
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
          console.log(response);
          messageElement.textContent =
            "Reset password link has been sent to " + email;
          messageElement.style.color = "green";
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
      });
  });