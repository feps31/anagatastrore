document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Kredensial yang valid (untuk contoh, seharusnya disimpan dengan aman di server)
        const validUsername = 'admin';
        const validPassword = 'password123';

        if (username === validUsername && password === validPassword) {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin.html'; // Redirect ke halaman admin
        } else {
            errorMessage.textContent = 'Username atau password salah!';
        }
    });
});
