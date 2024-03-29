document.getElementById("resetPasswordForm").addEventListener("submit", function(event) {
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
      // Here you can add your own logic to handle resetting the password,
      // such as sending a request to the server or displaying a success message.
      // For demonstration, let's just display a success message.
      messageElement.textContent = "Password reset successfully!";
      messageElement.style.color = "green";
      // Clear the password fields
      document.getElementById("password").value = "";
      document.getElementById("confirmPassword").value = "";
    }
  });
  