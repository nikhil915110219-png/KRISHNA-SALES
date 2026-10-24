/* =========================================================
   KRISHNA SALES
   Smart Retail Frontend
   HTML + CSS + JavaScript
========================================================= */


/* =========================================================
   DATA
========================================================= */

const products = [
  {
    id: 1,
    title: "Nova Wireless Buds",
    category: "electronics",
    price: 799,
    oldPrice: 1199,
    rating: 4.8,
    icon: "◉",
    badge: "BEST SELLER",
    description: "Compact wireless earbuds for everyday listening."
  },

  {
    id: 2,
    title: "Pulse Mini Speaker",
    category: "electronics",
    price: 999,
    oldPrice: 1499,
    rating: 4.7,
    icon: "◈",
    badge: "POPULAR",
    description: "Small wireless speaker with powerful everyday sound."
  },

  {
    id: 3,
    title: "Flex Fast Charger",
    category: "electronics",
    price: 499,
    oldPrice: 699,
    rating: 4.6,
    icon: "⚡",
    badge: "VALUE",
    description: "Compact fast charger designed for daily use."
  },

  {
    id: 4,
    title: "Orbit Desk Lamp",
    category: "home",
    price: 899,
    oldPrice: 1299,
    rating: 4.9,
    icon: "◐",
    badge: "NEW",
    description: "Minimal desk lighting with a modern premium look."
  },

  {
    id: 5,
    title: "Smart Aroma Diffuser",
    category: "home",
    price: 699,
    oldPrice: 999,
    rating: 4.5,
    icon: "✦",
    badge: "TRENDING",
    description: "Create a relaxing atmosphere with a compact diffuser."
  },

  {
    id: 6,
    title: "Magnetic Phone Stand",
    category: "accessories",
    price: 349,
    oldPrice: 499,
    rating: 4.7,
    icon: "◇",
    badge: "VALUE",
    description: "Clean magnetic stand for your desk or bedside."
  },

  {
    id: 7,
    title: "Urban Tech Pouch",
    category: "accessories",
    price: 449,
    oldPrice: 649,
    rating: 4.6,
    icon: "▣",
    badge: "HOT",
    description: "Organize your cables, chargers and small accessories."
  },

  {
    id: 8,
    title: "Desk Cable Hub",
    category: "accessories",
    price: 299,
    oldPrice: 399,
    rating: 4.4,
    icon: "⌁",
    badge: "SMART",
    description: "Keep your charging cables organized and accessible."
  }
];


/* =========================================================
   STATE
========================================================= */

let cart = JSON.parse(localStorage.getItem("ks_cart")) || [];

let wishlist =
  JSON.parse(localStorage.getItem("ks_wishlist")) || [];

let orders =
  JSON.parse(localStorage.getItem("ks_orders")) || [];

let currentCategory = "all";
let currentSearch = "";
let currentSort = "default";

let activeCoupon = null;
let modalProductId = null;


/* =========================================================
   ELEMENTS
========================================================= */

const productsGrid =
  document.getElementById("productsGrid");

const emptyProducts =
  document.getElementById("emptyProducts");

const productSearch =
  document.getElementById("productSearch");

const sortProducts =
  document.getElementById("sortProducts");

const cartBtn =
  document.getElementById("cartBtn");

const cartDrawer =
  document.getElementById("cartDrawer");

const closeCart =
  document.getElementById("closeCart");

const overlay =
  document.getElementById("overlay");

const cartItems =
  document.getElementById("cartItems");

const cartEmpty =
  document.getElementById("cartEmpty");

const cartCount =
  document.getElementById("cartCount");

const wishlistCount =
  document.getElementById("wishlistCount");

const cartSubtotal =
  document.getElementById("cartSubtotal");

const cartDiscount =
  document.getElementById("cartDiscount");

const cartTotal =
  document.getElementById("cartTotal");

const toast =
  document.getElementById("toast");

const productModal =
  document.getElementById("productModal");

const ordersModal =
  document.getElementById("ordersModal");


/* =========================================================
   HELPERS
========================================================= */

function formatPrice(number) {
  return "₹" + Number(number).toLocaleString("en-IN");
}


function saveState() {
  localStorage.setItem("ks_cart", JSON.stringify(cart));
  localStorage.setItem("ks_wishlist", JSON.stringify(wishlist));
  localStorage.setItem("ks_orders", JSON.stringify(orders));
}


function showToast(message) {
  const text = toast.querySelector("p");

  text.textContent = message;

  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


function getProduct(id) {
  return products.find(product => product.id === Number(id));
}


/* =========================================================
   HEADER
========================================================= */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

});


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenuBtn =
  document.getElementById("mobileMenuBtn");

const mobileNav =
  document.getElementById("mobileNav");

mobileMenuBtn.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
});


document.querySelectorAll(".mobile-nav a").forEach(link => {

  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
  });

});


/* =========================================================
   PRODUCT FILTERING
========================================================= */

function getFilteredProducts() {

  let result = [...products];

  if (currentCategory !== "all") {

    if (currentCategory === "under500") {

      result = result.filter(
        product => product.price < 500
      );

    } else {

      result = result.filter(
        product => product.category === currentCategory
      );

    }

  }


  if (currentSearch.trim() !== "") {

    const search = currentSearch.toLowerCase();

    result = result.filter(product =>
      product.title.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    );

  }


  if (currentSort === "low") {

    result.sort((a, b) => a.price - b.price);

  }

  if (currentSort === "high") {

    result.sort((a, b) => b.price - a.price);

  }

  if (currentSort === "rating") {

    result.sort((a, b) => b.rating - a.rating);

  }


  return result;
}


/* =========================================================
   PRODUCT RENDER
========================================================= */

function renderProducts() {

  const list = getFilteredProducts();

  productsGrid.innerHTML = "";

  if (list.length === 0) {

    emptyProducts.classList.add("show");

    return;

  }

  emptyProducts.classList.remove("show");


  list.forEach((product, index) => {

    const wished =
      wishlist.includes(product.id);

    const card =
      document.createElement("article");

    card.className = "product-card reveal";

    card.style.transitionDelay =
      `${index * 50}ms`;


    card.innerHTML = `

      <div class="product-visual">

        <span class="product-badge">
          ${product.badge}
        </span>

        <button
          class="product-wish ${wished ? "active" : ""}"
          data-wish="${product.id}"
          aria-label="Wishlist"
        >
          ${wished ? "♥" : "♡"}
        </button>

        <div class="product-art">
          ${product.icon}
        </div>

      </div>


      <div class="product-info">

        <span class="product-category">
          ${product.category}
        </span>

        <h3 class="product-title">
          ${product.title}
        </h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-bottom">

          <div class="product-price">

            <strong>
              ${formatPrice(product.price)}
            </strong>

            <del>
              ${formatPrice(product.oldPrice)}
            </del>

          </div>

          <div class="product-rating">
            ★ ${product.rating}
          </div>

        </div>

        <div class="product-actions">

          <button
            class="view-btn"
            data-view="${product.id}"
          >
            View
          </button>

          <button
            class="add-btn"
            data-add="${product.id}"
          >
            Add +
          </button>

        </div>

      </div>

    `;

    productsGrid.appendChild(card);

  });


  activateProductButtons();

  setTimeout(() => {

    document
      .querySelectorAll(".products-grid .reveal")
      .forEach(el => {

        observer.observe(el);

      });

  }, 20);

}


/* =========================================================
   PRODUCT BUTTONS
========================================================= */

function activateProductButtons() {

  document.querySelectorAll("[data-add]").forEach(button => {

    button.addEventListener("click", () => {

      addToCart(Number(button.dataset.add));

    });

  });


  document.querySelectorAll("[data-wish]").forEach(button => {

    button.addEventListener("click", () => {

      toggleWishlist(Number(button.dataset.wish));

    });

  });


  document.querySelectorAll("[data-view]").forEach(button => {

    button.addEventListener("click", () => {

      openProductModal(
        Number(button.dataset.view)
      );

    });

  });

}


/* =========================================================
   CATEGORY BUTTONS
========================================================= */

document.querySelectorAll("[data-category]").forEach(button => {

  button.addEventListener("click", () => {

    currentCategory =
      button.dataset.category;

    document
      .querySelectorAll("[data-category]")
      .forEach(btn =>
        btn.classList.remove("active")
      );

    document
      .querySelectorAll("[data-category]")
      .forEach(btn => {

        if (
          btn.dataset.category === currentCategory
        ) {
          btn.classList.add("active");
        }

      });


    document
      .querySelectorAll(".filter-chip")
      .forEach(chip =>
        chip.classList.remove("active")
      );


    const matchingChip =
      document.querySelector(
        `.filter-chip[data-filter="${currentCategory}"]`
      );

    if (matchingChip) {
      matchingChip.classList.add("active");
    }

    renderProducts();

    document
      .getElementById("products")
      .scrollIntoView({
        behavior: "smooth"
      });

  });

});


/* =========================================================
   FILTER CHIPS
========================================================= */

document.querySelectorAll(".filter-chip").forEach(chip => {

  chip.addEventListener("click", () => {

    currentCategory =
      chip.dataset.filter;

    document
      .querySelectorAll(".filter-chip")
      .forEach(c =>
        c.classList.remove("active")
      );

    chip.classList.add("active");

    document
      .querySelectorAll(".category-card")
      .forEach(c =>
        c.classList.remove("active")
      );

    const matching =
      document.querySelector(
        `.category-card[data-category="${currentCategory}"]`
      );

    if (matching) {
      matching.classList.add("active");
    }

    renderProducts();

  });

});


/* =========================================================
   SEARCH
========================================================= */

productSearch.addEventListener("input", e => {

  currentSearch =
    e.target.value;

  renderProducts();

});


/* =========================================================
   SORT
========================================================= */

sortProducts.addEventListener("change", e => {

  currentSort =
    e.target.value;

  renderProducts();

});


/* =========================================================
   WISHLIST
========================================================= */

function toggleWishlist(id) {

  if (wishlist.includes(id)) {

    wishlist =
      wishlist.filter(item => item !== id);

    showToast("Removed from wishlist");

  } else {

    wishlist.push(id);

    showToast("Added to wishlist");

  }

  saveState();

  updateCounters();

  renderProducts();

}


function updateCounters() {

  const totalItems =
    cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  cartCount.textContent =
    totalItems;

  wishlistCount.textContent =
    wishlist.length;

}


/* =========================================================
   CART
========================================================= */

function addToCart(id, quantity = 1) {

  const existing =
    cart.find(item => item.id === id);

  if (existing) {

    existing.quantity += quantity;

  } else {

    cart.push({
      id,
      quantity
    });

  }

  saveState();

  updateCounters();

  renderCart();

  showToast("Product added to cart");

}


function removeFromCart(id) {

  cart =
    cart.filter(item => item.id !== id);

  saveState();

  updateCounters();

  renderCart();

}


function changeQuantity(id, amount) {

  const item =
    cart.find(item => item.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {

    removeFromCart(id);
    return;

  }

  saveState();

  updateCounters();

  renderCart();

}


function calculateCart() {

  let subtotal = 0;

  cart.forEach(item => {

    const product =
      getProduct(item.id);

    if (product) {

      subtotal +=
        product.price * item.quantity;

    }

  });


  let discount = 0;

  if (activeCoupon) {

    discount =
      Math.round(
        subtotal * activeCoupon.percent / 100
      );

  }


  const total =
    Math.max(0, subtotal - discount);


  return {
    subtotal,
    discount,
    total
  };

}


/* =========================================================
   CART RENDER
========================================================= */

function renderCart() {

  cartItems.innerHTML = "";

  if (cart.length === 0) {

    cartEmpty.style.display = "flex";
    cartItems.style.display = "none";

  } else {

    cartEmpty.style.display = "none";
    cartItems.style.display = "block";


    cart.forEach(item => {

      const product =
        getProduct(item.id);

      if (!product) return;

      const row =
        document.createElement("div");

      row.className = "cart-item";

      row.innerHTML = `

        <div class="cart-item-art">
          ${product.icon}
        </div>

        <div>

          <h4>${product.title}</h4>

          <small>
            ${formatPrice(product.price)}
          </small>

          <div class="qty-control">

            <button
              data-minus="${product.id}"
            >
              −
            </button>

            <span>${item.quantity}</span>

            <button
              data-plus="${product.id}"
            >
              +
            </button>

          </div>

        </div>

        <div>

          <div class="cart-item-price">
            ${formatPrice(
              product.price * item.quantity
            )}
          </div>

          <button
            class="remove-cart"
            data-remove="${product.id}"
            style="
              margin-top:8px;
              border:0;
              background:transparent;
              color:#777;
              font-size:9px;
              cursor:pointer;
            "
          >
            REMOVE
          </button>

        </div>

      `;

      cartItems.appendChild(row);

    });

  }


  const totals =
    calculateCart();

  cartSubtotal.textContent =
    formatPrice(totals.subtotal);

  cartDiscount.textContent =
    "-" + formatPrice(totals.discount);

  cartTotal.textContent =
    formatPrice(totals.total);


  document.querySelectorAll("[data-minus]").forEach(btn => {

    btn.addEventListener("click", () => {

      changeQuantity(
        Number(btn.dataset.minus),
        -1
      );

    });

  });


  document.querySelectorAll("[data-plus]").forEach(btn => {

    btn.addEventListener("click", () => {

      changeQuantity(
        Number(btn.dataset.plus),
        1
      );

    });

  });


  document.querySelectorAll("[data-remove]").forEach(btn => {

    btn.addEventListener("click", () => {

      removeFromCart(
        Number(btn.dataset.remove)
      );

    });

  });

}


/* =========================================================
   CART OPEN / CLOSE
========================================================= */

function openCart() {

  cartDrawer.classList.add("open");
  overlay.classList.add("show");

  document.body.classList.add("no-scroll");

}


function closeCartDrawer() {

  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");

  document.body.classList.remove("no-scroll");

}


cartBtn.addEventListener("click", openCart);

closeCart.addEventListener(
  "click",
  closeCartDrawer
);

overlay.addEventListener(
  "click",
  closeCartDrawer
);


/* =========================================================
   CLEAR CART
========================================================= */

document
  .getElementById("clearCart")
  .addEventListener("click", () => {

    if (cart.length === 0) {

      showToast("Cart is already empty");
      return;

    }

    cart = [];

    saveState();

    updateCounters();

    renderCart();

    showToast("Cart cleared");

  });


/* =========================================================
   COUPONS
========================================================= */

const coupons = {
  KS10: 10,
  WELCOME: 5,
  FIRST20: 20
};


const couponInput =
  document.getElementById("couponInput");

const couponMessage =
  document.getElementById("couponMessage");


function applyCouponCode(code) {

  code =
    code.trim().toUpperCase();

  if (!code) {

    couponMessage.textContent =
      "Enter a coupon code.";

    couponMessage.className =
      "coupon-message error";

    return;

  }


  if (!coupons[code]) {

    couponMessage.textContent =
      "Invalid coupon code.";

    couponMessage.className =
      "coupon-message error";

    activeCoupon = null;

    renderCart();

    return;

  }


  activeCoupon = {
    code,
    percent: coupons[code]
  };


  couponMessage.textContent =
    `${code} applied — ${coupons[code]}% discount`;

  couponMessage.className =
    "coupon-message success";


  renderCart();

  showToast("Coupon applied");

}


document
  .getElementById("applyCoupon")
  .addEventListener("click", () => {

    applyCouponCode(
      couponInput.value
    );

  });


document
  .querySelectorAll("[data-coupon]")
  .forEach(button => {

    button.addEventListener("click", () => {

      couponInput.value =
        button.dataset.coupon;

      applyCouponCode(
        button.dataset.coupon
      );

    });

  });


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openProductModal(id) {

  const product =
    getProduct(id);

  if (!product) return;

  modalProductId =
    product.id;

  document.getElementById("modalCategory")
    .textContent =
    product.category.toUpperCase();

  document.getElementById("modalTitle")
    .textContent =
    product.title;

  document.getElementById("modalDescription")
    .textContent =
    product.description;

  document.getElementById("modalRating")
    .textContent =
    product.rating;

  document.getElementById("modalPrice")
    .textContent =
    formatPrice(product.price);

  document.getElementById("modalOldPrice")
    .textContent =
    formatPrice(product.oldPrice);

  document.getElementById("modalProductVisual")
    .textContent =
    product.icon;

  productModal.classList.add("open");

  document.body.classList.add("no-scroll");

}


document
  .getElementById("closeProductModal")
  .addEventListener("click", () => {

    productModal.classList.remove("open");

    document.body.classList.remove("no-scroll");

  });


productModal.addEventListener("click", e => {

  if (e.target === productModal) {

    productModal.classList.remove("open");

    document.body.classList.remove("no-scroll");

  }

});


document
  .getElementById("modalAddCart")
  .addEventListener("click", () => {

    if (!modalProductId) return;

    addToCart(modalProductId);

  });


document
  .getElementById("modalBuyNow")
  .addEventListener("click", () => {

    if (!modalProductId) return;

    const product =
      getProduct(modalProductId);

    sendWhatsAppOrder([
      {
        product,
        quantity: 1
      }
    ]);

  });


/* =========================================================
   WHATSAPP ORDER
========================================================= */

function sendWhatsAppOrder(items = null) {

  let orderItems = [];

  if (items) {

    orderItems = items;

  } else {

    orderItems =
      cart.map(item => ({
        product: getProduct(item.id),
        quantity: item.quantity
      }));

  }


  if (orderItems.length === 0) {

    showToast("Add a product first");

    return;

  }


  let subtotal = 0;

  let message =
    "Hello Krishna Sales! 👋%0A%0A";

  message +=
    "*NEW ORDER REQUEST*%0A%0A";


  orderItems.forEach(item => {

    if (!item.product) return;

    const total =
      item.product.price * item.quantity;

    subtotal += total;

    message +=
      `• ${encodeURIComponent(item.product.title)} x${item.quantity} — ${encodeURIComponent(formatPrice(total))}%0A`;

  });


  let discount = 0;

  if (activeCoupon) {

    discount =
      Math.round(
        subtotal *
        activeCoupon.percent /
        100
      );

  }


  const total =
    subtotal - discount;


  message += "%0A";

  message +=
    `Subtotal: ${encodeURIComponent(formatPrice(subtotal))}%0A`;

  if (discount > 0) {

    message +=
      `Discount: -${encodeURIComponent(formatPrice(discount))}%0A`;

    message +=
      `Coupon: ${activeCoupon.code}%0A`;

  }

  message +=
    `*Total: ${encodeURIComponent(formatPrice(total))}*%0A%0A`;

  message +=
    "Please confirm availability and delivery details.";


  const phone =
    "919151110219";

  const url =
    `https://wa.me/${phone}?text=${message}`;


  window.open(
    url,
    "_blank"
  );


  createLocalOrder(
    orderItems,
    total
  );

}


document
  .getElementById("checkoutBtn")
  .addEventListener("click", () => {

    sendWhatsAppOrder();

  });


document
  .getElementById("whatsappHero")
  .addEventListener("click", () => {

    const message =
      encodeURIComponent(
        "Hello Krishna Sales! I want to know about your products."
      );

    window.open(
      `https://wa.me/919151110219?text=${message}`,
      "_blank"
    );

  });


/* =========================================================
   LOCAL ORDER
========================================================= */

function createLocalOrder(items, total) {

  const orderId =
    "KS" +
    Date.now()
      .toString()
      .slice(-8);


  const order = {

    id: orderId,

    date:
      new Date().toLocaleString("en-IN"),

    total,

    status:
      "Awaiting confirmation",

    items:
      items.map(item => ({
        title: item.product.title,
        quantity: item.quantity
      }))

  };


  orders.unshift(order);

  orders =
    orders.slice(0, 10);

  saveState();

  updateTracking();

}


function updateTracking() {

  const box =
    document.getElementById("trackingBox");

  if (!orders.length) {

    box.innerHTML = `
      <span>No recent order</span>
      <strong>—</strong>
    `;

    return;

  }


  const latest =
    orders[0];

  box.innerHTML = `
    <span>${latest.status}</span>
    <strong>${latest.id}</strong>
  `;

}


function renderOrders() {

  const container =
    document.getElementById("ordersList");

  container.innerHTML = "";


  if (!orders.length) {

    container.innerHTML = `
      <div style="
        padding:30px 0;
        color:#888;
        font-size:12px;
      ">
        No local orders yet.
      </div>
    `;

    return;

  }


  orders.forEach(order => {

    const row =
      document.createElement("div");

    row.className =
      "order-row";

    row.innerHTML = `

      <div>

        <strong>
          ${order.id}
        </strong>

        <small>
          ${order.date}
        </small>

        <small>
          ${order.items
            .map(item =>
              `${item.title} × ${item.quantity}`
            )
            .join(", ")
          }
        </small>

        <small>
          Total: ${formatPrice(order.total)}
        </small>

      </div>

      <span class="order-status">
        ${order.status}
      </span>

    `;

    container.appendChild(row);

  });

}


document
  .getElementById("viewOrders")
  .addEventListener("click", () => {

    renderOrders();

    ordersModal.classList.add("open");

    document.body.classList.add("no-scroll");

  });


document
  .getElementById("closeOrdersModal")
  .addEventListener("click", () => {

    ordersModal.classList.remove("open");

    document.body.classList.remove("no-scroll");

  });


ordersModal.addEventListener("click", e => {

  if (e.target === ordersModal) {

    ordersModal.classList.remove("open");

    document.body.classList.remove("no-scroll");

  }

});


/* =========================================================
   PRICE CALCULATOR
========================================================= */

const calcPrice =
  document.getElementById("calcPrice");

const calcQty =
  document.getElementById("calcQty");

const calcTotal =
  document.getElementById("calcTotal");


function updateCalculator() {

  const price =
    Math.max(
      0,
      Number(calcPrice.value) || 0
    );

  const qty =
    Math.max(
      1,
      Number(calcQty.value) || 1
    );


  calcTotal.textContent =
    formatPrice(price * qty);

}


calcPrice.addEventListener(
  "input",
  updateCalculator
);

calcQty.addEventListener(
  "input",
  updateCalculator
);


/* =========================================================
   DEAL COUNTDOWN
========================================================= */

function getDealTarget() {

  let target =
    localStorage.getItem("ks_deal_target");

  if (!target) {

    target =
      Date.now() +
      24 * 60 * 60 * 1000;

    localStorage.setItem(
      "ks_deal_target",
      target
    );

  }

  return Number(target);

}


const dealTarget =
  getDealTarget();


function updateCountdown() {

  let difference =
    dealTarget - Date.now();


  if (difference <= 0) {

    localStorage.removeItem(
      "ks_deal_target"
    );

    location.reload();

    return;

  }


  const days =
    Math.floor(
      difference /
      (1000 * 60 * 60 * 24)
    );

  const hours =
    Math.floor(
      (difference /
        (1000 * 60 * 60)) %
      24
    );

  const minutes =
    Math.floor(
      (difference /
        (1000 * 60)) %
      60
    );

  const seconds =
    Math.floor(
      (difference / 1000) %
      60
    );


  document.getElementById("days")
    .textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours")
    .textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes")
    .textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds")
    .textContent =
    String(seconds).padStart(2, "0");

}


setInterval(
  updateCountdown,
  1000
);

updateCountdown();


document
  .getElementById("dealBtn")
  .addEventListener("click", () => {

    const dealProduct =
      products.find(
        product => product.id === 2
      );

    if (dealProduct) {

      addToCart(
        dealProduct.id
      );

      openCart();

    }

  });


/* =========================================================
   ANIMATED COUNTERS
========================================================= */

function animateCounter(element) {

  const target =
    Number(element.dataset.count);

  let current = 0;

  const duration = 1200;

  const start =
    performance.now();


  function update(time) {

    const progress =
      Math.min(
        (time - start) /
        duration,
        1
      );


    current =
      Math.floor(
        progress * target
      );


    element.textContent =
      current;


    if (progress < 1) {

      requestAnimationFrame(update);

    }

  }


  requestAnimationFrame(update);

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (
          entry.isIntersecting
        ) {

          entry.target.classList.add(
            "visible"
          );

          if (
            entry.target.matches(
              ".hero-stats strong"
            )
          ) {

            animateCounter(
              entry.target
            );

          }

          observer.unobserve(
            entry.target
          );

        }

      });

    },
    {
      threshold: .12
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach(element => {

    observer.observe(element);

  });


/* Counters */
document
  .querySelectorAll(
    ".hero-stats strong"
  )
  .forEach(element => {

    observer.observe(element);

  });


/* =========================================================
   MOUSE FOLLOW CURSOR
========================================================= */

const cursorDot =
  document.querySelector(".cursor-dot");

const cursorRing =
  document.querySelector(".cursor-ring");


if (
  window.matchMedia(
    "(pointer:fine)"
  ).matches
) {

  let mouseX = 0;
  let mouseY = 0;

  let ringX = 0;
  let ringY = 0;


  window.addEventListener(
    "mousemove",
    e => {

      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left =
        `${mouseX}px`;

      cursorDot.style.top =
        `${mouseY}px`;

    }
  );


  function animateCursor() {

    ringX +=
      (mouseX - ringX) * .13;

    ringY +=
      (mouseY - ringY) * .13;


    cursorRing.style.left =
      `${ringX}px`;

    cursorRing.style.top =
      `${ringY}px`;


    requestAnimationFrame(
      animateCursor
    );

  }


  animateCursor();


  document.addEventListener(
    "mouseover",
    e => {

      if (
        e.target.closest(
          "button, a, input, select"
        )
      ) {

        document.body.classList.add(
          "cursor-hover"
        );

      }

    }
  );


  document.addEventListener(
    "mouseout",
    e => {

      if (
        e.target.closest(
          "button, a, input, select"
        )
      ) {

        document.body.classList.remove(
          "cursor-hover"
        );

      }

    }
  );

}


/* =========================================================
   PRODUCT TILT
========================================================= */

document.addEventListener(
  "mousemove",
  e => {

    const card =
      e.target.closest(".product-card");

    if (!card) return;

    const rect =
      card.getBoundingClientRect();

    const x =
      e.clientX - rect.left;

    const y =
      e.clientY - rect.top;

    const rotateX =
      ((y / rect.height) - .5) * -5;

    const rotateY =
      ((x / rect.width) - .5) * 5;


    card.style.transform =
      `translateY(-8px) perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  }
);


document.addEventListener(
  "mouseout",
  e => {

    const card =
      e.target.closest(".product-card");

    if (!card) return;

    card.style.transform = "";

  }
);


/* =========================================================
   SEARCH SHORTCUT
========================================================= */

document.addEventListener(
  "keydown",
  e => {

    if (
      e.key === "/" &&
      document.activeElement.tagName !== "INPUT"
    ) {

      e.preventDefault();

      productSearch.focus();

      document
        .getElementById("products")
        .scrollIntoView({
          behavior: "smooth"
        });

    }


    if (e.key === "Escape") {

      closeCartDrawer();

      productModal.classList.remove(
        "open"
      );

      ordersModal.classList.remove(
        "open"
      );

      document.body.classList.remove(
        "no-scroll"
      );

    }

  }
);


/* =========================================================
   SEARCH BUTTON
========================================================= */

document
  .getElementById("searchBtn")
  .addEventListener("click", () => {

    document
      .getElementById("products")
      .scrollIntoView({
        behavior: "smooth"
      });

    setTimeout(() => {

      productSearch.focus();

    }, 600);

  });


/* =========================================================
   WISHLIST BUTTON
========================================================= */

document
  .getElementById("wishlistBtn")
  .addEventListener("click", () => {

    const wishedProducts =
      products.filter(
        product =>
          wishlist.includes(product.id)
      );


    if (!wishedProducts.length) {

      showToast(
        "Your wishlist is empty"
      );

      return;

    }


    currentSearch = "";

    productSearch.value = "";

    currentCategory = "all";

    renderProducts();


    showToast(
      `${wishedProducts.length} item(s) in wishlist`
    );


    document
      .getElementById("products")
      .scrollIntoView({
        behavior: "smooth"
      });

  });


/* =========================================================
   INITIALIZE
========================================================= */

renderProducts();

renderCart();

updateCounters();

updateCalculator();

updateTracking();


/* =========================================================
   EXTRA PARALLAX
========================================================= */

if (
  window.matchMedia(
    "(pointer:fine)"
  ).matches
) {

  const heroVisual =
    document.querySelector(
      ".hero-visual"
    );


  window.addEventListener(
    "mousemove",
    e => {

      if (!heroVisual) return;

      const x =
        (e.clientX /
          window.innerWidth -
          .5) * 12;

      const y =
        (e.clientY /
          window.innerHeight -
          .5) * 12;


      heroVisual.style.transform =
        `translate(${x * .25}px, ${y * .25}px)`;

    }
  );

}


/* =========================================================
   DONE
========================================================= */

console.log(
  "%c Krishna Sales %c Smart Retail System Loaded ",
  "background:#8b5cf6;color:white;padding:5px 10px;border-radius:5px;",
  "background:#111;color:#fff;padding:5px 10px;border-radius:5px;"
);