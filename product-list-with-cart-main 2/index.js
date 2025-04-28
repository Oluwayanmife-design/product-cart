const listProductHTML = document.getElementById("product-list");
const iconCart = document.querySelector(".icon-Cart");
const listCartHTML = document.querySelector(".listCart");
const totalPriceHTML = document.querySelector(".totalPrice2");
const btnConfirm = document.querySelector('.btn-confirm');
const modalHTML = document.querySelector('.modal');

let listProducts = [];
let carts = [];

const fetchProducts = async () => {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    listProducts = data;
    renderProducts();
    loadCartFromMemory();
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

const renderProducts = () => {
  listProductHTML.innerHTML = listProducts
    .map(
      (product) => `
    <div class="item" data-id="${product.id}">
      <img src="${product.image}" alt="" class="rounded-2xl w-[500px]">
      <div class="relative bottom-6 flex justify-center">
        <i class="fa-solid fa-cart-plus text-[#C83C0E] absolute bottom-3 left-12 space-x-4"></i>
        <button class="bg-white py-2 px-8 rounded-3xl border-2 border-[#d2a59d] font-semibold text-sm addCart">Add to Cart</button>
      </div>
      <div>
        <p class="text-[#a8a2a0] text-semibold">${product.category}</p>
        <h1 class="text-[#4C4140] font-bold text-sm">${product.name}</h1>
        <h3 class="text-[#e07460] font-extrabold">$${product.price}</h3>
      </div>
    </div>
  `
    )
    .join("");
};

const renderCart = () => {
  listCartHTML.innerHTML = carts
    .map((cart) => {
      const product = listProducts.find((p) => p.id == cart.data_id);
      return `
      <div class="item  grid grid-cols-4 gap-[5px] text-center items-center " data-id="${
        cart.data_id
      }">
        <div class="image">
          <img src="${product.image}" alt="">
        </div>
        <div class="name">${product.category}</div>
        <div class="totalPrice">$${product.price * cart.quantity}</div>
        <div class="quantity">
          <span class="minus bg-[#C83C0E]  text-white px-1 cursor-pointer">-</span>
          <span class="rounded-full w-[200px] text-[#C83C0E] px-2">${
            cart.quantity
          }</span>
          <span class="plus bg-[#C83C0E]  text-white px-1 cursor-pointer">+</span>
        </div>
        <button class="remove bg-[#C83C0E] rounded-full w-[20px] text-white my-5 cursor-pointer">Remove</button>
      </div>
    `;
    })
    .join("");

  updateCartSummary();
};

 

  



const updateCartSummary = () => {
  const totalQuantity = carts.reduce((sum, cart) => sum + cart.quantity, 0);
  const totalPrice = carts.reduce((sum, cart) => {
    const product = listProducts.find((p) => p.id == cart.data_id);
    return sum + product.price * cart.quantity;
  }, 0);

  iconCart.textContent = totalQuantity;
  totalPriceHTML.textContent = ` Order Total: $${totalPrice.toFixed(2)}`;
};

const addToCart = (data_id) => {
  const cartItem = carts.find((cart) => cart.data_id == data_id);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    carts.push({ data_id, quantity: 1 });
  }
  saveCartToMemory();
  renderCart();
};

const changeQuantity = (data_id, type) => {
  const cartItem = carts.find((cart) => cart.data_id == data_id);
  if (cartItem) {
    if (type === "plus") {
      cartItem.quantity += 1;
    } else if (type === "minus") {
      cartItem.quantity = Math.max(0, cartItem.quantity - 1);
      if (cartItem.quantity === 0) {
        carts = carts.filter((cart) => cart.data_id != data_id);
      }
    } else if (type === "remove") {
      carts = carts.filter((cart) => cart.data_id != data_id);
    }
    saveCartToMemory();
    renderCart();
  }
};

const saveCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

const loadCartFromMemory = () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    carts = JSON.parse(savedCart);
    renderCart();
  }
};

listProductHTML.addEventListener("click", (event) => {
  if (event.target.classList.contains("addCart")) {
    const data_id = event.target.closest(".item").dataset.id;
    addToCart(data_id);
  }
});

listCartHTML.addEventListener("click", (event) => {
  const data_id = event.target.closest(".item").dataset.id;
  if (event.target.classList.contains("minus")) {
    changeQuantity(data_id, "minus");
  } else if (event.target.classList.contains("plus")) {
    changeQuantity(data_id, "plus");
  } else if (event.target.classList.contains("remove")) {
    changeQuantity(data_id, "remove");
  }
});
 

const initApp = () => {
  fetchProducts();
};

initApp();

btnConfirm.addEventListener("click", function () {
  console.log("Button clicked");
  modalHTML.classList.remove("hidden");
});