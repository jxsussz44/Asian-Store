/* =========================================================
   ASIAN STORE AGUACHICA — catálogo, carrito y WhatsApp
   JavaScript vanilla. El catálogo se edita en PRODUCTS.
   ========================================================= */

// Productos del catálogo, con precios en pesos colombianos (COP).
// Las fotos se encuentran en la carpeta assets/ del proyecto.
const PRODUCTS = [
  {
    id: "buldak-queso",
    name: "Ramen Buldak Cuatro Quesos",
    category: "Ramen",
    price: 17900,
    description: "145 g · Cremoso, intenso y lleno de sabor.",
    image: "assets/ramen-buldak-queso.jpg"
  },
  {
    id: "shin-ramyun",
    name: "Ramen Shin Ramyun Tradicional",
    category: "Ramen",
    price: 9900,
    description: "El clásico coreano para los amantes del picante.",
    image: "assets/ramen-shin-ramyun.jpg"
  },
  {
    id: "buldak-cream-carbonara",
    name: "Ramen Buldak Cream Carbonara",
    category: "Ramen",
    price: 16900,
    description: "Una mezcla cremosa con el toque Buldak.",
    image: "assets/ramen-buldak-cream-carbonara.jpg"
  },
  {
    id: "buldak-rose",
    name: "Ramen Buldak Rosé",
    category: "Ramen",
    price: 16900,
    description: "Sabor rosé con una textura irresistible.",
    image: "assets/ramen-buldak-rose.jpg"
  },
  {
    id: "chapagetti",
    name: "Chapagetti",
    category: "Ramen",
    price: 11900,
    description: "Fideos coreanos con una salsa intensa.",
    image: "assets/chapagetti.jpg"
  },
  {
    id: "buldak-yakisoba",
    name: "Ramen Buldak Yakisoba",
    category: "Ramen",
    price: 16900,
    description: "Una opción de fideos con carácter y picante.",
    image: "assets/ramen-buldak-yakisoba.jpg"
  },
  {
    id: "tteokbokki",
    name: "Tteokbokki Buldak Carbonara",
    category: "Snacks",
    price: 37900,
    description: "Topokki picante estilo carbonara · 179 g.",
    image: "assets/tteokbokki-buldak.jpg"
  },
  {
    id: "kimchi-bibigo",
    name: "Kimchi Bibigo",
    category: "Acompañamientos",
    price: 14900,
    description: "Kimchi coreano de col napa · 150 g.",
    image: "assets/kimchi-bibigo.jpg"
  },
  {
    id: "buldak-cup-carbonara",
    name: "Ramen Buldak Carbonara Cup",
    category: "Ramen",
    price: 19900,
    description: "Presentación en vaso, práctica y deliciosa.",
    image: "assets/ramen-buldak-cup.jpg"
  },
  {
    id: "orange-ade",
    name: "Korean Pouch Drink Orange Ade",
    category: "Bebidas",
    price: 15900,
    description: "Bebida coreana con sabor a naranja.",
    image: "assets/drink-orange-ade.jpg"
  },
  {
    id: "letsbe-cappuccino",
    name: "Lata de Café Cappuccino LET'S BE",
    category: "Bebidas",
    price: 9900,
    description: "Café listo para tomar, práctico y diferente.",
    image: "assets/cafe-cappuccino.jpg"
  },
  {
    id: "apple-ade",
    name: "Korean Pouch Drink Apple Ade",
    category: "Bebidas",
    price: 15900,
    description: "Bebida coreana con sabor a manzana.",
    image: "assets/drink-apple-ade.jpg"
  }
];

// Número de WhatsApp de la tienda en formato internacional, sin + ni espacios.
const WHATSAPP_NUMBER = "573161666977";
const CART_STORAGE_KEY = "asianStoreAguachicaCart";

// Referencias a elementos del DOM.
const productGrid = document.querySelector("#product-grid");
const categoryFilters = document.querySelector("#category-filters");
const productSearch = document.querySelector("#product-search");
const noResults = document.querySelector("#no-results");
const cartToggle = document.querySelector("#cart-toggle");
const cartCount = document.querySelector("#cart-count");
const cartOverlay = document.querySelector("#cart-overlay");
const cartDrawer = document.querySelector("#cart-drawer");
const cartClose = document.querySelector("#cart-close");
const cartItemsContainer = document.querySelector("#cart-items");
const cartSubtotal = document.querySelector("#cart-subtotal");
const cartTotal = document.querySelector("#cart-total");
const checkoutButton = document.querySelector("#checkout-button");
const clearCartButton = document.querySelector("#clear-cart");
const clearSearchButton = document.querySelector("#clear-search");
const toast = document.querySelector("#toast");
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

// Estado de la interfaz.
let selectedCategory = "Todos";
let searchQuery = "";
let cart = loadCart();
let toastTimer;
let lastFocusedElement = null;

/** Formatea un valor como moneda colombiana, sin decimales. */
function formatPrice(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}

/** Recupera el carrito guardado; si el almacenamiento falla, empieza vacío. */
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};

    // Conserva únicamente productos conocidos y cantidades enteras positivas.
    return Object.fromEntries(
      Object.entries(saved)
        .filter(([id, quantity]) => PRODUCTS.some((product) => product.id === id)
          && Number.isInteger(quantity) && quantity > 0)
        .map(([id, quantity]) => [id, Math.min(quantity, 99)])
    );
  } catch (error) {
    console.warn("No se pudo recuperar el carrito guardado.", error);
    return {};
  }
}

/** Guarda el carrito actual en el navegador. */
function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    // El carrito sigue funcionando aunque el navegador bloquee localStorage.
    console.warn("No se pudo guardar el carrito en este navegador.", error);
  }
}

/** Devuelve el catálogo que coincide con el filtro y la búsqueda. */
function getVisibleProducts() {
  const query = searchQuery.trim().toLocaleLowerCase("es-CO");

  return PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const searchableText = `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("es-CO");
    return matchesCategory && searchableText.includes(query);
  });
}

/** Dibuja las tarjetas del catálogo. */
function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.innerHTML = visibleProducts.map((product, index) => {
    const alreadyInCart = Boolean(cart[product.id]);
    return `
      <article class="product-card" style="animation-delay:${Math.min(index * 35, 210)}ms">
        <div class="product-image-wrap">
          <span class="product-category">${product.category}</span>
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-card-body">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-bottom">
            <div class="product-price"><small>Precio</small><strong>${formatPrice(product.price)}</strong></div>
            <button class="add-button${alreadyInCart ? " added" : ""}" type="button" data-add="${product.id}" aria-label="Agregar ${product.name} al carrito" title="Agregar al carrito">${alreadyInCart ? "✓" : "+"}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  noResults.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
}

/** Cambia la categoría visualmente seleccionada. */
function selectCategory(category) {
  selectedCategory = category;
  categoryFilters.querySelectorAll("[data-category]").forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
}

/** Agrega una unidad del producto seleccionado al carrito. */
function addToCart(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return;

  if ((cart[productId] || 0) >= 99) {
    showToast("Puedes agregar hasta 99 unidades de cada producto.");
    return;
  }

  cart[productId] = (cart[productId] || 0) + 1;
  saveCart();
  renderCart();
  renderProducts();
  showToast(`${product.name} agregado al carrito`);
}

/** Cambia una cantidad o elimina la línea si llega a cero. */
function changeQuantity(productId, difference) {
  if (!cart[productId]) return;
  const nextQuantity = cart[productId] + difference;

  if (nextQuantity <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = Math.min(nextQuantity, 99);
  }

  saveCart();
  renderCart();
  renderProducts();
}

/** Elimina un producto específico del carrito. */
function removeFromCart(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  delete cart[productId];
  saveCart();
  renderCart();
  renderProducts();
  if (product) showToast(`${product.name} eliminado del carrito`);
}

/** Calcula cantidades, subtotal y total a partir del estado actual. */
function getCartSummary() {
  const items = Object.entries(cart).map(([id, quantity]) => {
    const product = PRODUCTS.find((item) => item.id === id);
    return product ? { ...product, quantity, lineTotal: product.price * quantity } : null;
  }).filter(Boolean);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  // No se suma domicilio porque su valor depende de la confirmación por WhatsApp.
  return { items, itemCount, subtotal, total: subtotal };
}

/** Dibuja las líneas, el contador y los totales del carrito. */
function renderCart() {
  const summary = getCartSummary();
  cartCount.textContent = summary.itemCount > 99 ? "99+" : String(summary.itemCount);
  cartToggle.setAttribute("aria-label", `Abrir carrito de compras, ${summary.itemCount} productos`);
  cartSubtotal.textContent = formatPrice(summary.subtotal);
  cartTotal.textContent = formatPrice(summary.total);
  checkoutButton.disabled = summary.items.length === 0;
  clearCartButton.disabled = summary.items.length === 0;
  clearCartButton.style.opacity = summary.items.length === 0 ? ".4" : "1";
  clearCartButton.style.cursor = summary.items.length === 0 ? "not-allowed" : "pointer";

  if (summary.items.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-illustration" aria-hidden="true">🛍️</div>
        <h3>Tu carrito está esperando</h3>
        <p>Todavía no agregas productos. Explora el catálogo y encuentra tu próximo antojo.</p>
        <button class="button button-primary" type="button" data-close-cart>Ver productos <span aria-hidden="true">↗</span></button>
      </div>
    `;
    return;
  }

  cartItemsContainer.innerHTML = summary.items.map((item) => `
    <article class="cart-item">
      <div class="cart-item-image"><img src="${item.image}" alt="" loading="lazy" /></div>
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-unit">${formatPrice(item.price)} c/u</p>
        <div class="quantity-control" aria-label="Cantidad de ${item.name}">
          <button type="button" data-cart-action="decrease" data-id="${item.id}" aria-label="Disminuir cantidad de ${item.name}">−</button>
          <span aria-live="polite">${item.quantity}</span>
          <button type="button" data-cart-action="increase" data-id="${item.id}" aria-label="Aumentar cantidad de ${item.name}">+</button>
        </div>
      </div>
      <div class="cart-item-side">
        <strong class="cart-item-line-total">${formatPrice(item.lineTotal)}</strong>
        <button class="remove-item" type="button" data-cart-action="remove" data-id="${item.id}">Eliminar</button>
      </div>
    </article>
  `).join("");
}

/** Abre el carrito lateral y guarda el elemento que tenía el foco. */
function openCart() {
  lastFocusedElement = document.activeElement;
  cartOverlay.classList.add("is-open");
  cartOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  window.setTimeout(() => cartClose.focus(), 80);
}

/** Cierra el carrito y devuelve el foco al control anterior. */
function closeCart() {
  cartOverlay.classList.remove("is-open");
  cartOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

/** Vacía todo el carrito con una sola acción. */
function clearCart() {
  if (Object.keys(cart).length === 0) return;
  cart = {};
  saveCart();
  renderCart();
  renderProducts();
  showToast("Carrito vaciado");
}

/** Muestra una notificación breve de confirmación. */
function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

/** Prepara un mensaje detallado y abre WhatsApp con el pedido. */
function checkoutViaWhatsApp() {
  const summary = getCartSummary();
  if (summary.items.length === 0) {
    showToast("Agrega al menos un producto antes de continuar.");
    return;
  }

  const orderLines = summary.items.map((item) =>
    `• ${item.name}\n  Cantidad: ${item.quantity}\n  Precio unitario: ${formatPrice(item.price)}\n  Importe: ${formatPrice(item.lineTotal)}`
  );

  const message = [
    "¡Hola, Asian Store Aguachica! 👋 Quiero realizar este pedido:",
    "",
    ...orderLines,
    "",
    `Subtotal: ${formatPrice(summary.subtotal)}`,
    `TOTAL DE PRODUCTOS: ${formatPrice(summary.total)}`,
    "",
    "¿Me confirman la disponibilidad y el valor del domicilio, si aplica?",
    "¡Gracias!"
  ].join("\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const newWindow = window.open(whatsappUrl, "_blank");

  // Evita que la pestaña externa pueda controlar la página de la tienda.
  if (newWindow) {
    newWindow.opener = null;
  } else {
    // Si el navegador bloquea ventanas emergentes, usa la pestaña actual.
    window.location.href = whatsappUrl;
  }
}

/** Cierra el menú móvil al elegir una sección. */
function closeMobileMenu() {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
}

// Eventos: delegación de clics en el catálogo y el contenido del carrito.
productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);
});

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) selectCategory(button.dataset.category);
});

productSearch.addEventListener("input", (event) => {
  searchQuery = event.target.value;
  renderProducts();
});

clearSearchButton.addEventListener("click", () => {
  productSearch.value = "";
  searchQuery = "";
  selectCategory("Todos");
  productSearch.focus();
});

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) closeCart();
});

cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-cart]")) {
    closeCart();
    document.querySelector("#productos").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const actionButton = event.target.closest("[data-cart-action]");
  if (!actionButton) return;

  const { cartAction, id } = actionButton.dataset;
  if (cartAction === "increase") changeQuantity(id, 1);
  if (cartAction === "decrease") changeQuantity(id, -1);
  if (cartAction === "remove") removeFromCart(id);
});

clearCartButton.addEventListener("click", clearCart);
checkoutButton.addEventListener("click", checkoutViaWhatsApp);

// Menú hamburguesa para pantallas pequeñas.
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));

// Cerrar overlays con Escape.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (cartOverlay.classList.contains("is-open")) closeCart();
    closeMobileMenu();
  }
});

// Año automático en el pie de página.
document.querySelector("#current-year").textContent = new Date().getFullYear();

// Render inicial: catálogo y estado del carrito guardado.
document.querySelector("#count-all").textContent = String(PRODUCTS.length);
renderProducts();
renderCart();
