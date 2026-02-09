// Product Data
const products = [
    {
        id: 1,
        name: "台灣在地酪梨",
        description: "來自台南的新鮮酪梨，果肉綿密香濃，營養價值極高",
        details: "產地：台南 | 重量：約250-300g/顆 | 熟度：5-7天可食用",
        price: 80,
        image: "🥑"
    },
    {
        id: 2,
        name: "精選大顆酪梨",
        description: "特選大顆酪梨，適合全家分享，果肉飽滿香甜",
        details: "產地：嘉義 | 重量：約350-400g/顆 | 熟度：5-7天可食用",
        price: 120,
        image: "🥑"
    },
    {
        id: 3,
        name: "酪梨禮盒組（6入）",
        description: "精心挑選6顆優質酪梨，送禮自用兩相宜",
        details: "產地：台灣各地精選 | 總重：約1.8kg | 精美禮盒包裝",
        price: 450,
        image: "🎁"
    },
    {
        id: 4,
        name: "酪梨家庭組（12入）",
        description: "大份量家庭組，經濟實惠，全家一起享受健康美味",
        details: "產地：台灣各地精選 | 總重：約3.6kg | 紙箱包裝",
        price: 850,
        image: "📦"
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    setupContactForm();
    setupCheckoutForm();
});

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-icon">${product.image}</div>
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-details">${product.details}</p>
            <div class="product-price">NT$ ${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                加入購物車
            </button>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showNotification(`${product.name} 已加入購物車！`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Save Cart
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = `NT$ ${totalPrice}`;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">購物車是空的</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">NT$ ${item.price} × ${item.quantity}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">刪除</button>
                </div>
            </div>
        `).join('');
    }
}

// Toggle Cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

// Show Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('購物車是空的！');
        return;
    }

    toggleCart();

    const modal = document.getElementById('checkoutModal');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    checkoutItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>NT$ ${item.price * item.quantity}</span>
        </div>
    `).join('');

    checkoutTotal.textContent = `NT$ ${totalPrice}`;

    modal.classList.add('active');
}

// Close Checkout
function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.remove('active');
}

// Setup Contact Form
function setupContactForm() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('感謝您的訊息！我們會盡快回覆。');
        form.reset();
    });
}

// Setup Checkout Form
function setupCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const orderData = {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            address: document.getElementById('customerAddress').value,
            note: document.getElementById('orderNote').value,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString()
        };

        console.log('訂單資料：', orderData);

        showNotification('訂單已送出！我們會盡快與您聯繫確認。');

        cart = [];
        saveCart();
        updateCartUI();

        closeCheckout();
        form.reset();
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});