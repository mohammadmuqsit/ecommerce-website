// ---------- CART STORAGE ----------
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const saveCart = (c) => localStorage.setItem("cart", JSON.stringify(c));

// ---------- PRODUCTS PAGE ----------
async function loadProducts() {
  const productsEl = document.getElementById("products");
  if (!productsEl) return; // page not products

  const res = await fetch("/api/products");
  const products = await res.json();

  productsEl.innerHTML = products
    .map(
      (p) => `
      <div class="card">
        <img src="${p.image}" alt="">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick='addToCart(${JSON.stringify(p)})'>
          Add to Cart
        </button>
      </div>`
    )
    .join("");
}

function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
  alert("Added to cart!");
}

// ---------- CART PAGE ----------
function renderCart() {
  const cartEl = document.getElementById("cart");
  if (!cartEl) return; // page not cart

  const cart = getCart();
  const total = cart.reduce((t, p) => t + Number(p.price), 0);

  cartEl.innerHTML =
    cart.map((c) => `<p>${c.name} — ₹${c.price}</p>`).join("") +
    `<h3>Total: ₹${total}</h3>`;

  return total;
}

// ---------- CHECKOUT ----------
function setupCheckout() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const total = renderCart();

  form.onsubmit = async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));
    data.total = total;

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const j = await res.json();
    document.getElementById("msg").textContent = j.message;
    localStorage.removeItem("cart");
  };
}

// ---------- INIT ----------
loadProducts();
renderCart();
setupCheckout();
