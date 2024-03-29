document.getElementById('signup').addEventListener('submit', function(event) {
    
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    
    if (username.toLowerCase() === "admin" || email.toLowerCase() === "admin@example.com") {
        alert("هذه البيانات محظورة، الرجاء إدخال بيانات أخرى.");
        return; 
    }

    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
        alert("كلمة المرور يجب أن تحتوي على على الأقل 8 أحرف، واحدة على الأقل من الأحرف الكبيرة والصغيرة والأرقام والرموز الخاصة.");
        return;
    }
    
    
    console.log("تم إرسال البيانات:");
    console.log("اسم المستخدم: " + username);
    console.log("البريد الإلكتروني: " + email);
    console.log("كلمة المرور: " + password);
});
