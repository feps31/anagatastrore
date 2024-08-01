document.addEventListener('DOMContentLoaded', () => {
    // Cek apakah admin sudah login
    function checkAdminLoggedIn() {
        if (localStorage.getItem('adminLoggedIn') !== 'true') {
            window.location.href = 'login.html'; // Redirect ke halaman login jika tidak login
        }
    }

    // Fungsi untuk memuat pengajuan pengembalian dari localStorage
    function loadReturnRequests() {
        return JSON.parse(localStorage.getItem('returnRequests')) || [];
    }

    // Fungsi untuk memperbarui daftar pengajuan di DOM
    function updateReturnRequests() {
        const returnRequestsList = document.getElementById('return-requests-list');
        const returnRequests = loadReturnRequests();

        returnRequestsList.innerHTML = '';
        returnRequests.forEach((request, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div>
                    Pesanan ID: ${request.orderId} <br>
                    Alasan: ${request.reason} <br>
                    Status: ${request.status} <br>
                    <button class="approve-btn" data-index="${index}">Setujui</button>
                    <button class="reject-btn" data-index="${index}">Tolak</button>
                </div>
            `;
            returnRequestsList.appendChild(listItem);
        });
    }

    // Fungsi untuk memperbarui status pengajuan di localStorage
    function updateReturnRequestStatus(index, status) {
        let returnRequests = loadReturnRequests();
        if (returnRequests[index]) {
            returnRequests[index].status = status;
            localStorage.setItem('returnRequests', JSON.stringify(returnRequests));
            const message = `Pengajuan pengembalian untuk pesanan ID ${returnRequests[index].orderId} telah ${status}.`;
            sendWhatsAppMessage(message);
            updateReturnRequests();
        }
    }

    // Fungsi untuk mengirim pesan WhatsApp
    function sendWhatsAppMessage(message) {
        const phoneNumber = '62081214025170'; // Ganti dengan nomor WhatsApp Anda
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    // Event listener untuk tombol persetujuan dan penolakan
    document.getElementById('return-requests-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('approve-btn')) {
            const index = e.target.getAttribute('data-index');
            updateReturnRequestStatus(index, 'Disetujui');
        } else if (e.target.classList.contains('reject-btn')) {
            const index = e.target.getAttribute('data-index');
            updateReturnRequestStatus(index, 'Ditolak');
        }
    });

    // Fungsi logout
    function logout() {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html'; // Redirect ke halaman login
    }

    document.getElementById('logout-btn').addEventListener('click', logout);

    // Periksa apakah admin sudah login saat halaman dimuat
    checkAdminLoggedIn();
    updateReturnRequests();
});
