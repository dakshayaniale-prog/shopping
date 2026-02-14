// Cart page specific functionality
window.addEventListener('DOMContentLoaded', () => {
    displayCart();
    updateCartCount();
});

function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');

    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }

    cartEmpty.style.display = 'none';
    cartContent.style.display = 'flex';
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, parseInt(this.value))">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="btn-remove" onclick="confirmRemove(${item.id})">Remove</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });

    updateCartSummary();
}

function confirmRemove(productId) {
    if (confirm('Are you sure you want to remove this item from cart?')) {
        removeFromCart(productId);
        displayCart();
        showNotification('Item removed from cart');
    }
}

function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10.00 : 0;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('shipping').textContent = '$' + shipping.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}

// Override updateQuantity to refresh display
const originalUpdateQuantity = updateQuantity;
updateQuantity = function(productId, quantity) {
    originalUpdateQuantity(productId, quantity);
    displayCart();
};

// Modal functionality
const modal = document.getElementById('checkout-modal');
const checkoutBtn = document.getElementById('checkout-btn');
const closeBtn = document.querySelector('.close');

checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Checkout form submission
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 10.00;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;
    
    // Get payment method text
    const paymentSelect = document.getElementById('payment-method');
    const paymentMethodText = paymentSelect.options[paymentSelect.selectedIndex].text;
    
    const orderData = {
        orderNumber: generateOrderNumber(),
        items: cart,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        customerName: document.getElementById('customer-name').value,
        customerEmail: document.getElementById('customer-email').value,
        customerPhone: document.getElementById('customer-phone').value,
        customerAddress: document.getElementById('customer-address').value,
        paymentMethod: paymentMethodText,
        orderDate: new Date().toLocaleString()
    };
    
    // Store order data
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Redirect to success page
    window.location.href = 'order-success.html';
});
