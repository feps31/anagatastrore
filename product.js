document.addEventListener('DOMContentLoaded', () => {
    // Mengambil parameter query dari URL
    const params = new URLSearchParams(window.location.search);
    const productName = params.get('product');

    // Jika tidak ada nama produk, tampilkan pesan error
    if (!productName) {
        document.getElementById('product-details');
        return;
    }

    // Data produk (harus disesuaikan dengan data produk Anda)
    const products = {
        'Panic-Hoodie': {
            name: 'Panic Hoodie',
            image: 'assets/hoodie/grey.JPEG',
            details: 'Deskripsi lengkap untuk Panic Hoodie.',
            sizes: 'S, M, L, XL',
        },
        'Bottom-Hoodie': {
            name: 'Bottom Hoodie',
            image: 'assets/hoodie/black.JPEG',
            details: 'Deskripsi lengkap untuk Bottom Hoodie.',
            sizes: 'S, M, L, XL',
        },
        // Tambahkan produk lainnya di sini
    };

    const product = products[productName];

    // Jika produk ditemukan, tampilkan detailnya
    if (product) {
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-details').textContent = product.details;
        document.getElementById('product-sizes').textContent = `Ukuran: ${product.sizes}`;
    } else {
        document.getElementById('product-details').textContent = 'Produk tidak ditemukan.';
    }
});
