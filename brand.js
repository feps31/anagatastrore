document.addEventListener('DOMContentLoaded', () => {
    // Fungsi untuk menghasilkan UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Buat dan simpan ID unik di localStorage jika belum ada
    function getUniqueId() {
        let id = localStorage.getItem('uniqueId');
        if (!id) {
            id = generateUUID();
            localStorage.setItem('uniqueId', id);
        }
        return id;
    }

    const uniqueId = getUniqueId();

    function saveCart() {
        localStorage.setItem(`cart-${uniqueId}`, JSON.stringify(cart));
    }

    function loadCart() {
        const savedCart = localStorage.getItem(`cart-${uniqueId}`);
        if (savedCart) {
            return JSON.parse(savedCart);
        }
        return [];
    }

    // Format uang menggunakan Intl.NumberFormat
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });

    // Variabel dan elemen DOM untuk keranjang belanja
    let cart = loadCart(); // Load cart from localStorage
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElem = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const phoneNumber = '62081214025170'; // Ganti dengan nomor WhatsApp Anda (format internasional tanpa tanda '+')

    // Update keranjang belanja di DOM
    function updateCart() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${item.name} (${item.sizes}) - ${item.quantity} x ${formatter.format(item.price)}
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            cartItemsList.appendChild(listItem);
            total += item.quantity * item.price;
        });

        cartTotalElem.textContent = `Total: ${formatter.format(total)}`;
    }

    // Menambah item ke keranjang belanja
    function addToCart(name, price, sizes) {
        const existingItem = cart.find(item => item.name === name && item.sizes === sizes);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1, sizes });
        }
        saveCart();
        updateCart();
    }

    // Menghapus item dari keranjang belanja
    function removeFromCart(index) {
        if (confirm('Apakah Anda yakin ingin menghapus item ini dari keranjang?')) {
            cart.splice(index, 1);
            saveCart();
            updateCart();
        }
    }

    // Proses checkout
    function checkout() {
        if (cart.length === 0) {
            alert('Keranjang belanja kosong.');
            return;
        }

        // Generate a unique ID for this checkout
        const orderId = generateUUID();

        let message = `Hallo, saya ingin melakukan pemesanan dengan ID pesanan: ${orderId}\n\n`;
        let total = 0;

        cart.forEach(item => {
            message += `• ${item.name} (${item.sizes}) - ${item.quantity} x ${formatter.format(item.price)}\n`;
            total += item.quantity * item.price;
        });

        message += `\nTotal: ${formatter.format(total)}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    }

    // Kirim pesan WhatsApp
    function sendWhatsAppMessage(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    // Simpan data pengembalian
    function saveReturnRequest(orderId, reason) {
        let returnRequests = JSON.parse(localStorage.getItem('returnRequests')) || [];
        returnRequests.push({ orderId, reason, status: 'Menunggu Persetujuan' });
        localStorage.setItem('returnRequests', JSON.stringify(returnRequests));
    }

    // Kirim pesan WhatsApp untuk pengajuan pengembalian
    function sendReturnRequestNotification(orderId, reason) {
        const message = `Pengajuan pengembalian untuk pesanan ID ${orderId} dengan alasan: ${reason} memerlukan persetujuan.`;
        sendWhatsAppMessage(message);
    }

    // Formulir pengembalian
    const returnOrderForm = document.getElementById('return-order-form');
    if (returnOrderForm) {
        returnOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const orderId = document.getElementById('return-order-id').value.trim();
            const reason = document.getElementById('return-reason').value.trim();
            if (orderId && reason) {
                saveReturnRequest(orderId, reason);
                sendReturnRequestNotification(orderId, reason);
                alert('Pengajuan pengembalian telah diajukan dan menunggu persetujuan.');
                returnOrderForm.reset();
            }
        });
    }

    // Menangani persetujuan pengembalian di halaman admin
    if (window.location.pathname.includes('admin.html')) {
        const returnRequestsList = document.getElementById('return-requests-list');

        function loadReturnRequests() {
            return JSON.parse(localStorage.getItem('returnRequests')) || [];
        }

        function updateReturnRequests() {
            returnRequestsList.innerHTML = '';
            const returnRequests = loadReturnRequests();

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

        returnRequestsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('approve-btn')) {
                const index = e.target.getAttribute('data-index');
                updateReturnRequestStatus(index, 'Disetujui');
            } else if (e.target.classList.contains('reject-btn')) {
                const index = e.target.getAttribute('data-index');
                updateReturnRequestStatus(index, 'Ditolak');
            }
        });

        updateReturnRequests();
    }

    // Event listener untuk tombol produk
    document.querySelectorAll('#btn-add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-name');
            const productPrice = parseInt(button.getAttribute('data-price'), 10);
            const productSize = button.parentElement.querySelector('.product-size').value;
            addToCart(productName, productPrice, productSize);
        });
    });

    // Event listener untuk tombol hapus item
    cartItemsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index);
        }
    });

    // Event listener untuk tombol checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    // Fitur Rating dan Ulasan
    const reviewForm = document.getElementById('review-form');
    const reviewRating = document.getElementById('review-rating');
    const reviewText = document.getElementById('review-text');
    const reviewsList = document.getElementById('reviews-items');

    // Load ulasan dari localStorage
    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        return reviews;
    }

    // Save ulasan ke localStorage
    function saveReviews(reviews) {
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    // Update daftar ulasan di DOM
    function updateReviews() {
        reviewsList.innerHTML = '';
        const reviews = loadReviews();
        
        reviews.forEach((review) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                Rating: ${review.rating} <br>
                Ulasan: ${review.text}
            `;
            reviewsList.appendChild(listItem);
        });
    }

    // Kirim ulasan
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rating = reviewRating.value.trim();
            const text = reviewText.value.trim();
            if (rating && text) {
                const reviews = loadReviews();
                reviews.push({ rating, text });
                saveReviews(reviews);
                updateReviews();
                reviewForm.reset();
            }
        });

        updateReviews();
    }

    updateCart();
});