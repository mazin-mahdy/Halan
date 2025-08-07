let cart = [];

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.qty} (${item.price * item.qty} LE)
      <button onclick="removeItem(${index})">❌</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: ${total} LE`;
  cartCount.textContent = count;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

function clearCart() {
  cart = [];
  updateCartDisplay();
}

function toggleCart() {
  const popup = document.getElementById("cartPopup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function filterItems() {
  const search = document.getElementById("searchBox").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const items = document.querySelectorAll(".item");

  items.forEach(item => {
    const name = item.querySelector("h3").textContent.toLowerCase();
    const inCategory = category === "all" || item.classList.contains(category);
    const matchesSearch = name.includes(search);
    item.style.display = inCategory && matchesSearch ? "block" : "none";
  });
}

function sendWhatsAppOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !address) {
    alert("Please enter your name and address.");
    return;
  }

  let message = `*🛒 New Order from Halan - In Nakhel*\n\n`;
  let total = 0;

  cart.forEach((item, i) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    message += `${i + 1}. ${item.name} x${item.qty} = ${itemTotal} LE\n`;
  });

  const deliveryRadios = document.getElementsByName("delivery");
  let deliveryCost = 0;
  let deliveryText = "";

  deliveryRadios.forEach(r => {
    if (r.checked) {
      deliveryCost = parseInt(r.value);
      deliveryText = r.value === "15" ? "Standard (30–45 min)" : "Fast (20–30 min)";
    }
  });

  message += `\n🚚 Delivery: ${deliveryText} – ${deliveryCost} LE`;
  message += `\n💵 Total: ${total + deliveryCost} LE`;
  message += `\n\n👤 Name: ${name}`;
  message += `\n📍 Address: ${address}`;

  const encoded = encodeURIComponent(message);
  const phone = "201553370060";
  const link = `https://wa.me/${phone}?text=${encoded}`;
  window.open(link, "_blank");
}
