//menu.js

const menus = JSON.parse(document.getElementById('menus-data').textContent.replaceAll('&#34;', '"'));
const orderList = [];
const customList = [];

// 初始化 orderList，將數量大於 0 的菜單項添加進去
menus.forEach(menu => {
  if (menu.quantity > 0) {
    orderList.push({ ...menu });
  }
});

// 頁面加載後渲染初始點單列表
document.addEventListener('DOMContentLoaded', () => {
  renderOrderList();
});

function addToOrder(index) {
  const menu = menus[index];
  const existingOrder = orderList.find(order => order.name === menu.name);

  if (existingOrder) {
    existingOrder.quantity += 1;
  } else {
    orderList.push({ ...menu, quantity: 1});
  }

  renderOrderList();
}

function addToCustom(index, quantity) {
  const menu = menus[index];
  const existingCustom = customList.find(order => order.name === menu.name);

  if (existingCustom) {
    existingCustom.quantity = quantity;
  } else {
    customList.push({ ...menu, quantity: quantity});
  }

  renderCustomList();
}

function deleteFromCustom(index) {
  let listIndex = customList.findIndex(order => order.index === index);
  customList.splice(listIndex, 1);

  renderCustomList();
}

function updateOrderQuantity(index, change) {
  let listIndex = orderList.findIndex(order => order.index === index);
  const order = orderList[listIndex];
  order.quantity += change;

  if (order.quantity <= 0) {
    orderList.splice(listIndex, 1);
  }

  renderOrderList();
}

function updateCustomQuantity(index, change) {
  let listIndex = customList.findIndex(order => order.index === index);
  let topQuantity = orderList.find(order => order.index === index).quantity;
  console.log("name: ", customList[listIndex].name, "topQuantity: ", topQuantity);

  const order = customList[listIndex];
  if (change > 0 && order.quantity >= topQuantity) {
    alert("超過最大數量");
    return;
  } else {
    order.quantity += change;
  }

  if (order.quantity <= 0) {
    customList.splice(listIndex, 1);
  }

  renderCustomList();
}

function renderOrderList() {
  const orderListElement = document.querySelector('#order-list');
  orderListElement.innerHTML = '';

  orderList.forEach((order) => {
    const li = document.createElement('li');
    li.className = 'order-item';
    li.innerHTML = `
      <span>${order.name} | 價錢: ${order.price} | 數量: ${order.quantity}</span>
      <span><button onclick="updateOrderQuantity(${order.index}, 1)">+</button>
      <button onclick="updateOrderQuantity(${order.index}, -1)">-</button></span>
      <button onclick="addToCustom(${order.index}, ${order.quantity})">add</button>
    `;
    orderListElement.appendChild(li);
  });

  const span = document.createElement('span');
  span.innerHTML = `總價: ${orderList.reduce((acc, order) => acc + order.price * order.quantity, 0)}`;
  orderListElement.appendChild(span);
}

function renderCustomList() {
  const customListElement = document.querySelector('#custom-list');
  customListElement.innerHTML = '';

  customList.forEach((order) => {
    const li = document.createElement('li');
    li.className = 'order-item';
    li.innerHTML = `
      <span>${order.name} | 價錢: ${order.price} | 數量: ${order.quantity}</span>
      <span><button onclick="updateCustomQuantity(${order.index}, 1)">+</button>
      <button onclick="updateCustomQuantity(${order.index}, -1)">-</button></span>
      <span><button onclick="deleteFromCustom(${order.index})">del</button></span>
    `;
    customListElement.appendChild(li);
  });

  const span = document.createElement('span');
  span.innerHTML = `總價: ${customList.reduce((acc, order) => acc + order.price * order.quantity, 0)}`;
  customListElement.appendChild(span);
}