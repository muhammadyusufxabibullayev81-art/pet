
window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".loader").classList.add("hide");
    }, 1000);
});

const filters = document.querySelectorAll(".filter-btn");
const pets = document.querySelectorAll(".pet-card");

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        filters.forEach(item => item.classList.remove("active"));
        btn.classList.add("active");

        pets.forEach(pet => {
            pet.classList.toggle("hide",
                btn.dataset.filter !== "all" &&
                pet.dataset.category !== btn.dataset.filter
            );
        });
    });
});

const cart = [];
const cartPanel = document.querySelector(".cart-panel");
const overlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");

function openCart() {
    cartPanel.classList.add("active");
    overlay.classList.add("active");
}

function closeCart() {
    cartPanel.classList.remove("active");
    overlay.classList.remove("active");
}

document.querySelector(".cart-open").addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".shop-card");
        const name = card.querySelector("h3").textContent;
        const price = Number(card.querySelector(".shop-price").textContent.replace(/\D/g, ""));
        const image = card.querySelector("img").src;

        const existing = cart.find(item => item.name === name);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }

        btn.textContent = "Qo‘shildi";
        setTimeout(() => btn.textContent = "Savatga qo‘shish", 1200);

        document.querySelector(".checkout-message").textContent = "";
        renderCart();
    });
});

function renderCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Savatingiz hozircha bo‘sh</p>';
    }

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toLocaleString("uz-UZ")} so‘m × ${item.quantity}</p>
                </div>
                <button class="remove-item" data-index="${index}">O‘chirish</button>
            </div>
        `;
    });

    document.querySelector(".cart-count").textContent = count;
    document.querySelector(".total-price").textContent = total.toLocaleString("uz-UZ");

    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", () => {
            cart.splice(Number(btn.dataset.index), 1);
            renderCart();
        });
    });
}

document.querySelector(".checkout-btn").addEventListener("click", () => {
    const message = document.querySelector(".checkout-message");

    if (cart.length === 0) {
        message.textContent = "Avval savatga mahsulot qo‘shing!";
        return;
    }

    cart.length = 0;
    renderCart();
    message.textContent = "Buyurtmangiz qabul qilindi!";
});

document.querySelectorAll(".pet-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const name = btn.closest(".pet-card").querySelector("h3").textContent;
        document.querySelector(".form-message").textContent =
            name + " haqida ma'lumot olish uchun bizga yozing.";
        document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
    });
});

const topBtn = document.querySelector(".top-btn");

window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 500);
});

topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector(".contact-form").addEventListener("submit", e => {
    e.preventDefault();
    document.querySelector(".form-message").textContent = "Xabaringiz yuborildi!";
    e.target.reset();
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.animate([
                { opacity: 0, transform: "translateY(35px)" },
                { opacity: 1, transform: "translateY(0)" }
            ], {
                duration: 800,
                fill: "forwards",
                easing: "ease-out"
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".section-heading, .pet-card, .service-card, .shop-card, .review-card, .about-content, .about-image").forEach(item => {
    observer.observe(item);
});
