const cartIcon = document.querySelector("#cart-icon"); // Cart icon
const cart = document.querySelector(".cart"); // Cart container
const cartClose = document.querySelector("#cart-close"); // Close button

// Show the cart when clicking the cart icon
cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});

// Hide the cart when clicking the close button
cartClose.addEventListener("click", () => {
  cart.classList.remove("active");
});

const addCartButtons = document.querySelectorAll(".add-cart");
const cartContent = document.querySelector(".cart-content");

addCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const productBox = event.target.closest(".product-box");
    addToCart(productBox);
  });
});

// Move updateTotalPrice function here (outside addToCart)
const updateTotalPrice = () => {
  const totalPriceElement = document.querySelector(".total-price");
  const totalCartBoxes = document.querySelectorAll(".cart-box"); // Select all cart boxes
  let total = 0;

  totalCartBoxes.forEach((cartBox) => {
    const priceElement = cartBox.querySelector(".cart-price");
    const quantityElement = cartBox.querySelector(".number");

    const price = parseFloat(priceElement.textContent.replace("$", "")); // Convert to number
    const quantity = parseInt(quantityElement.textContent); // Convert to number

    total += price * quantity; // Calculate total for this cart box
  });

  totalPriceElement.textContent = `$${total.toFixed(2)}`; // Update total price with 2 decimal places
};

const addToCart = (productBox) => {
  const productImgSrc = productBox.querySelector("img").src;
  const productTitle = productBox.querySelector(".product-title").textContent;
  const productPrice = productBox.querySelector(".price").textContent;

  // Check if the product already exists in the cart
  const cartItems = cartContent.querySelectorAll(".cart-product-title");
  for (let item of cartItems) {
    if (item.textContent === productTitle) {
      alert("This item is already in the cart.");
      return;
    }
  }

  // If not, add a new cart item
  const cartBox = document.createElement("div");
  cartBox.classList.add("cart-box");
  cartBox.innerHTML = `
        <img src="${productImgSrc}" class="cart-img">
        <div class="cart-detail">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button id="decrement">-</button>
                <span class="number">1</span>
                <button id="increment">+</button>
            </div>
        </div>
        <i class="ri-delete-bin-line cart-remove"></i>
    `;
  cartContent.appendChild(cartBox);

  // Add event listeners for increment, decrement, and remove buttons
  cartBox.querySelector(".cart-remove").addEventListener("click", () => {
    cartBox.remove();
    updateCartCount(-1);
    updateTotalPrice(); // Update the total price after removing an item
  });

  cartBox.querySelector(".cart-quantity").addEventListener("click", (event) => {
    const numberElement = cartBox.querySelector(".number");
    const decrementButton = cartBox.querySelector("#decrement");
    let quantity = parseInt(numberElement.textContent); // Ensure quantity is a number

    if (event.target.id === "decrement" && quantity > 1) {
      quantity--;
      if (quantity === 1) {
        decrementButton.style.color = "#999"; // Change color for minimum limit
      }
    } else if (event.target.id === "increment") {
      quantity++;
      decrementButton.style.color = "#333"; // Reset color
    }

    numberElement.textContent = quantity; // Update the quantity in the DOM
    updateTotalPrice(); // Update the total price after quantity change
  });

  updateCartCount(1);
  updateTotalPrice(); // Update total price when a new item is added
};
let cartItemCount=0;
const updateCartCount=change=>{
    const cartItemCountBadge=document.querySelector(".cart-item-count");
    cartItemCount+=change;
    if(cartItemCount>0){
        cartItemCountBadge.style.visibility="visible";
        cartItemCountBadge.textContent=cartItemCount;

    }
    else{
        cartItemCountBadge.style.visibility="hidden";
        cartItemCountBadge.textContent="";
    }
}
const buyNowButton=document.querySelector(".btn-buy");

buyNowButton.addEventListener("click",()=>{
    const cartBoxes=cartContent.querySelectorAll(".cart-box");
    if(cartBoxes.length===0){
        alert("Your cart is empty.please add items to your cart before buying");
        return;
    }
    cartBoxes.forEach(cartBox=>cartBox.remove());

    cartItemCount=0

    updateCartCount(0);
    updateTotalPrice();
    alert("Thank you for purchase!!");
})