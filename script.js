let cart = [];

const CART_STORAGE_KEY = "book-catalog-cart";

const products = document.querySelectorAll(".product");
const cartItems = document.getElementById("cart-items");
const totalElement = document.getElementById("cart-total");
const filterSelect = document.getElementById("filter-category");
const clearCartButton = document.getElementById("clear-cart-btn");
const payButton = document.getElementById("pay-btn");

const saveCart = () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const loadCart = () => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return;
    try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) cart = parsedCart;
    } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
    }
};

filterSelect.addEventListener("change", function() {
    const selected = filterSelect.value;
    products.forEach((product) => {
        product.style.display = (selected === "all" || product.dataset.category === selected) ? "block" : "none";
    });
});

const calculateTotal = () => cart.reduce((sum, item) => sum + item.price, 0);

const renderCart = () => {
    cartItems.innerHTML = "";
    if (cart.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "Корзина пуста";
        cartItems.appendChild(emptyItem);
    } else {
        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = item.name + " — " + item.price + " руб. ";
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Удалить";
            removeBtn.addEventListener("click", () => {
                cart.splice(index, 1);
                renderCart();
            });
            li.appendChild(removeBtn);
            cartItems.appendChild(li);
        });
    }
    totalElement.textContent = "Итого: " + calculateTotal() + " руб.";
    saveCart();
};

const addToCart = (product) => {
    cart.push(product);
    renderCart();
};

const clearCart = () => {
    cart = [];
    renderCart();
};

document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function() {
        const product = button.closest(".product");
        addToCart({
            name: product.dataset.name,
            price: Number(product.dataset.price),
            category: product.dataset.category
        });
    });
});

clearCartButton.addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Корзина уже пуста");
        return;
    }
    clearCart();
});

payButton.addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Корзина пуста");
    } else {
        alert("Покупка прошла успешно!");
        clearCart();
    }
});

loadCart();
renderCart();
