function validateEmail() {
    var email = document.getElementById("username").value;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(email)) {
        document.getElementById("message").innerText = "البريد الإلكتروني صحيح. يمكنك الدخول.";
    } else {
        document.getElementById("message").innerText = "البريد الإلكتروني غير صحيح. الرجاء المحاولة مرة أخرى.";
    }
}
