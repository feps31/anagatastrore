document.getElementById('loginform').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah pengiriman formulir default

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === '' || password === '') {
        alert('Username dan password tidak boleh kosong.');
        return;
    }

    if (username === 'user' && password === 'user123') {
        // Animasi sebelum redirect
        document.querySelector('.container').classList.add('fade-out');
        setTimeout(() => {
            alert('Login berhasil, beralih ke halaman selanjutnya.');
            window.location.href = 'index.html';
        }, 500); // Durasi animasi fade-out
    } else {
        alert('username atau password tidak salah silahkan coba lagi!');
        document.querySelector('.container').classList.add('shake');
        setTimeout(() => {
            document.querySelector('.container').classList.remove('shake');
        }, 500); // Durasi efek shake
    }
});
