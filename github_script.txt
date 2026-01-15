//📄 script.js（接案範例等級）
/* ========= 桌號（來自 QR Code） ========= */
const params = new URLSearchParams(location.search);
const tableNo = params.get("table") || "未指定";
document.getElementById("tableInfo").textContent = `🪑 桌號：${tableNo}`;

/* ========= 菜單 ========= */
const menu = [
  { id: 1, name: "紅茶", price: 30 },
  { id: 2, name: "綠茶", price: 25 },
  { id: 3, name: "奶茶", price: 50 }
];

const orders = [];

/* ========= 初始化菜單 ========= */
const menuEl = document.getElementById("menu");
menu.forEach(item => {
  const li = document.createElement("li");
  li.innerHTML = `
    ${item.name} $${item.price}
    <select onchange="addOrder(${item.id}, this.value)">
      <option value="">選甜度</option>
      <option value="正常">正常</option>
      <option value="少糖">少糖</option>
      <option value="無糖">無糖</option>
    </select>

    <select onchange="setIce(${item.id}, this.value)">
      <option value="">冰塊</option>
      <option value="正常冰">正常冰</option>
      <option value="少冰">少冰</option>
      <option value="去冰">去冰</option>
    </select>
  `;
  menuEl.appendChild(li);
});

/* ========= 建立訂單 ========= */
function createOrder(productId, sugar = "正常", ice = "正常冰") {
  const p = menu.find(m => m.id === productId);
  return {
    productId: p.id,
    productName: p.name,
    price: p.price,
    quantity: 1,
    sugar,
    ice
  };
}

function addOrder(productId, sugar) {
  if (!sugar) return;

  const exist = orders.find(o =>
    o.productId === productId && o.sugar === sugar
  );

  if (exist) {
    exist.quantity++;
  } else {
    orders.push(createOrder(productId, sugar));
  }
  renderOrders();
}

function setIce(productId, ice) {
  const o = orders.find(o => o.productId === productId);
  if (o) o.ice = ice;
}

/* ========= 計算 ========= */
function getTotal() {
  return orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
}

/* ========= 顯示 ========= */
function renderOrders() {
  const el = document.getElementById("orders");
  el.innerHTML = "";
  orders.forEach(o => {
    const li = document.createElement("li");
    li.textContent =
      `${o.productName} x${o.quantity}｜${o.sugar}｜${o.ice}`;
    el.appendChild(li);
  });
  document.getElementById("total").textContent =
    `💰 總金額：$${getTotal()}`;
}

/* ========= 送出 ========= */
async function submitOrder() {
  if (orders.length === 0) {
    alert("請先點餐");
    return;
  }

  const payload = {
    tableNo,
    orders,
    note: document.getElementById("note").value,
    total: getTotal(),
    time: new Date().toLocaleString()
  };

  try {
    const res = await fetch("你的 GAS Web App URL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const txt = await res.text();
    if (txt !== "OK") throw new Error(txt);

    alert("✅ 訂單送出成功");
    orders.length = 0;
    renderOrders();

  } catch (e) {
    alert("❌ 送出失敗");
    console.error(e);
  }
}
