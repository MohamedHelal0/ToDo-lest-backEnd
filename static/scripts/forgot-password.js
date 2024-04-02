document.getElementById("forgotPasswordForm").addEventListener("submit", function(event) {
  event.preventDefault();
  var email = document.getElementById("email").value;
  var messageElement = document.getElementById("message");
  
  // Clear any previous messages
  messageElement.innerHTML = "";

  // Here you can add your own logic to handle the forgot password functionality,
  // such as sending a reset password email or displaying a message.
  // For demonstration, let's just display a message.
  messageElement.textContent = "Sending reset password link to " + email + "...";

  // Simulate sending reset password link (you should replace this with actual logic)
  setTimeout(function() {
    // Display success message
    messageElement.textContent = "Reset password link has been sent to " + email;
    messageElement.style.color = "green";
    // Clear the email input field
    document.getElementById("email").value = "";
  }, 2000); // Simulate a delay of 2 seconds, replace with actual logic
});
