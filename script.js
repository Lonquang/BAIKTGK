// Đăng nhập
// Tìm kiếm món ăn
function searchFood() {
  const keyword = document.getElementById("search-food").value.trim().toLowerCase();
  if (!keyword) {
    alert("Vui lòng nhập tên món ăn cần tìm.");
    return;
  }

  const items = document.querySelectorAll('.restaurant-card');
  let found = false;

  items.forEach(card => {
    const name = card.querySelector('h3').textContent.toLowerCase();
    if (name.includes(keyword)) {
      found = true;

      // Cuộn đến vị trí món ăn
      card.scrollIntoView({ behavior: "smooth", block: "center" });

      // Tự động thêm vào giỏ hàng nếu có giá
      const priceText = card.querySelector('p').textContent;
      const match = priceText.match(/⭐\s*\d+/);
      const price = match ? parseFloat(match[0].replace(/[^0-9]/g, '')) : 4.99;

      const itemName = card.querySelector('h3').textContent;
      addToCart(itemName, price);

      alert(`✅ Đã tìm thấy và thêm "${itemName}" vào giỏ hàng.`);
    }
  });

  if (!found) {
    alert(`❌ Không tìm thấy món ăn phù hợp với: "${keyword}"`);
  }
}

// Đăng nhập và lưu tên người dùng
function login() {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Vui lòng nhập tên đăng nhập.");
    return;
  }

  localStorage.setItem("loggedInUser", username);
  alert(`Xin chào ${username}! Bạn đã đăng nhập thành công.`);
}

// Tìm món ăn nhanh
function findFood() {
  const address = document.getElementById("address").value;
  const type = document.getElementById("order-type").value;
  if (!address) {
    alert("Vui lòng nhập địa chỉ!");
    return;
  }
  alert(`Tìm món ăn gần "${address}" với hình thức "${type}"`);
  addToCartSimple("🍜 Mì cay đặc biệt");
}
    
// Thêm món đơn giản vào danh sách giỏ hàng hiển thị
function addToCartSimple(item) {
  const cartList = document.getElementById("cart-items");
  const li = document.createElement("li");
  li.textContent = item;
  cartList.appendChild(li);
}

// Giỏ hàng nâng cao
let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartDisplay();
  alert(`${name} đã được thêm vào giỏ hàng!`);
}

function updateCartDisplay() {
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartList.appendChild(li);
    total += item.price;
  });

  // Kiểm tra hoặc tạo phần hiển thị tổng tiền
  let totalDiv = document.getElementById("cart-total");
  if (!totalDiv) {
    totalDiv = document.createElement("div");
    totalDiv.id = "cart-total";
    totalDiv.style.marginTop = "10px";
    totalDiv.style.fontWeight = "bold";
    totalDiv.style.color = "#d62828";
    cartList.parentNode.appendChild(totalDiv);
  }

  totalDiv.textContent = `Tổng tiền: $${total.toFixed(2)}`;
}
function confirmOrder() {
  const username = localStorage.getItem("loggedInUser");
  const addressInput = document.getElementById("address");
  const address = addressInput ? addressInput.value.trim() : "";

  if (!username) {
    alert("Bạn cần đăng nhập trước khi xác nhận đơn hàng.");
    return;
  }

  if (!address) {
    alert("Vui lòng nhập địa chỉ giao hàng trước khi xác nhận đơn hàng.");
    return;
  }

  if (cart.length === 0) {
    alert("Giỏ hàng đang trống. Vui lòng chọn món trước khi xác nhận.");
    return;
  }

  const voucherInput = document.getElementById("voucher-code");
  const voucherCode = voucherInput ? voucherInput.value.trim().toUpperCase() : "";
  let discountPercent = 0;

  if (voucherCode === "GIAM10") {
    discountPercent = 10;
  } else if (voucherCode === "GIAM20") {
    discountPercent = 20;
  } else if (voucherCode) {
    alert("Mã giảm giá không hợp lệ. Không áp dụng khuyến mãi.");
  }

  const confirmText = cart.map(item => `- ${item.name}: $${item.price.toFixed(2)}`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = total * (discountPercent / 100);
  const finalTotal = total - discountAmount;

  const message = `👤 Khách hàng: ${username}\n📍 Địa chỉ: ${address}\n\nBạn xác nhận đặt các món sau:\n${confirmText}\n\nTổng tiền: $${total.toFixed(2)}\nGiảm giá: ${discountPercent}% (-$${discountAmount.toFixed(2)})\n👉 Thành tiền: $${finalTotal.toFixed(2)}\n\n✅ Vui lòng thanh toán để hoàn tất đơn hàng.`;
  alert(message);

  localStorage.setItem("confirmedOrder", JSON.stringify(cart));
  localStorage.setItem("appliedVoucher", voucherCode);
  localStorage.setItem("deliveryAddress", address);
}
function clearCart() {
  cart = [];
  updateCartDisplay();
  localStorage.removeItem("cartItems");
  alert("Giỏ hàng đã được xóa!");
}

function goToCart() {
  localStorage.setItem("cartItems", JSON.stringify(cart));
  window.location.href = "cart.html";
}

// Chuyển trang Popular Items
let currentPage = 0;
const itemsPerPage = 5;

function updateItems() {
  const items = document.querySelectorAll(".popular-items .item");
  items.forEach((item, index) => {
    if (index >= currentPage * itemsPerPage && index < (currentPage + 1) * itemsPerPage) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

function nextPage() {
  const items = document.querySelectorAll(".popular-items .item");
  if ((currentPage + 1) * itemsPerPage < items.length) {
    currentPage++;
    updateItems();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    updateItems();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateItems();
  updateCartDisplay();
});

// Cập nhật ngày khuyến mãi
document.querySelectorAll('.days').forEach(el => {
  let days = parseInt(el.textContent.match(/\d+/)[0]);
  let future = new Date();
  future.setDate(future.getDate() + days);
  el.textContent = `${days} Days Remaining (until ${future.toDateString()})`;
});

// Popup hướng dẫn
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");
const closeBtn = document.querySelector(".close");

function showPopup(message) {
  popupText.textContent = message;
  popup.style.display = "block";
}

document.getElementById("step-location").addEventListener("click", () => {
  showPopup("Let's choose your delivery location!");
});
document.getElementById("step-order").addEventListener("click", () => {
  showPopup("Browse menus and pick your favorite dish!");
});
document.getElementById("step-payment").addEventListener("click", () => {
  showPopup("Select your preferred payment method.");
});
document.getElementById("step-enjoy").addEventListener("click", () => {
  showPopup("Sit back and enjoy your meal!");
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === popup) popup.style.display = "none";
});
// phan7
  function scrollLeft() {
    document.getElementById("food-list").scrollBy({ left: -200, behavior: "smooth" });
  }

  function scrollRight() {
    document.getElementById("food-list").scrollBy({ left: 200, behavior: "smooth" });
  }

  function orderFood(name) {
    alert(`Bạn đã chọn đặt món: ${name}`);
    addToCart(name, 3.99); // Giá mẫu, bạn có thể thay đổi theo món
  }
// PHAN 8 - Nút tải ứng dụng

  document.querySelectorAll('.store-buttons a').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const platform = this.classList.contains('google-play') ? 'Google Play' : 'App Store';
      alert(`Đang tải ứng dụng từ ${platform}...`);
      
       window.location.href = this.href;
    });
  });
//   PHAN9
function orderNow(itemName) {
  alert(`Bạn đã chọn đặt món: ${itemName}`);
  addToCart(itemName, 4.99); // Giá mẫu, bạn có thể thay đổi theo từng món
}
// PHAN10
  // Đặt món khi bấm nút
  function orderNow(itemName) {
    alert(`Bạn đã chọn đặt món: ${itemName}`);
    // Ví dụ thêm vào giỏ hàng:
    // addToCart(itemName, 4.99);
  }

  // Chọn thành phố khi bấm vào tên
  function selectCity(cityName) {
    alert(`Bạn đã chọn khu vực: ${cityName}`);
    localStorage.setItem("selectedCity", cityName);
    // window.location.href = `/restaurants?city=${encodeURIComponent(cityName)}`;
  }

  // Gắn sự kiện cho nút "PROCEED TO ORDER"
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.trim().toLowerCase().includes('proceed')) {
      btn.addEventListener('click', () => orderNow('Best Deals'));
    }
  });

  // Gắn sự kiện cho các thành phố
  document.querySelectorAll('.city-lists li').forEach(li => {
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      const city = li.textContent.trim();
      selectCity(city);
    });
  });

  // Tìm email trong Gmail có chứa từ "thông tin"
  async function fetchGmailInfo() {
    try {
      const response = await fetch("/copilot/gmail/thong-tin"); // ví dụ endpoint giả định
      const data = await response.json();
      console.log("Email liên quan đến 'thông tin':", data);
      // Bạn có thể hiển thị ra giao diện nếu muốn
    } catch (error) {
      console.error("Không thể lấy email từ Gmail:", error);
    }
  }
