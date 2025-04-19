document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
  
    
    const getData = async ()=>{
      const response = await axios("http://localhost:3000/products")
      let products = response.data
      
      const findProduct = products.find((product) => product.id == id);
      console.log(findProduct)
      const productContainer = document.querySelector(".product-container");
  
  if (!findProduct) {
    productContainer.innerHTML = "<p>Product not found.</p>";
    return;
  }
  
      productContainer.innerHTML = `
      <div class="product-image">
        <img class="img" src="${findProduct.image}" alt="">
      </div>
      <div class="product-details">
        <h4 class="product-title">${findProduct.title}</h4>
        <p class="product-price">${findProduct.price}</p>
        <p class="product-description">${findProduct.description}</p>
        <div class="product-rating">
          <span class="fa-solid fa-star" style="color: #FFD43B;">${findProduct.rating.rate}</span>
          <span>(${findProduct.rating.count} reviews)</span>
        </div>
        <div class="quantity-selector">
          <button class="btn-minus">-</button>
          <input type="number" class="quantity-input" value="1" min="1">
          <button class="btn-plus">+</button>
        </div>
        <button class="btn btn-danger add-to-cart-btn" data-id="${findProduct.id}">Add to Cart</button>
      </div>`;
  
      const addToCartBtn = document.querySelector(".add-to-cart-btn");
      const quantityInput = document.querySelector(".quantity-input");
      const plusBtn = document.querySelector(".btn-plus");
      const minusBtn = document.querySelector(".btn-minus");
  
      const getQuantity = () => Math.max(1, +quantityInput.value || 1);
  
      const refreshQuantity = () => {
        quantityInput.value = getQuantity();
        minusBtn.disabled = getQuantity() <= 1;
      };
  
      refreshQuantity();
  
      plusBtn.addEventListener("click", () => {
        quantityInput.value = getQuantity() + 1;
        refreshQuantity();
      });
  
      minusBtn.addEventListener("click", () => {
        quantityInput.value = getQuantity() - 1;
        refreshQuantity();
      });
  
      addToCartBtn.addEventListener("click", () => {
        const quantity = getQuantity();
        addToBasketFromDetails(findProduct.id, quantity, products);
      });
  
      let users = JSON.parse(localStorage.getItem("users")) || [];
  
      let currentUser = users.find((user) => user.isLogined == true);
      
      function addToBasketFromDetails(productId, quantity, products) {
        if (!currentUser) {
          sweetToast("Please login to basket");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 3000);
          return;
        }
      
        let userIndex = users.findIndex(user => user.id === currentUser.id);
      
        if (userIndex === -1) {
          console.error("Current user not found in users array.");
          return;
        }
      
        let userBasket = users[userIndex].basket || [];
        let findProductInBasket = userBasket.find(product => product.id == productId);
      
        if (findProductInBasket) {
          findProductInBasket.count += quantity;
        } else {
          let existProduct = products.find(product => product.id == productId);
          if (existProduct) {
            userBasket.push({ ...existProduct, count: quantity });
          }
        }
      
        users[userIndex].basket = userBasket;
        localStorage.setItem("users", JSON.stringify(users));
      
        sweetToast("Product added to basket successfully...");
        window.location.href = "basket.html";
      }
      console.log(response.data)
    }
    getData()
  });
      
  
  
  const sweetToast = (text) => {
    Toastify({
      text: text,
      duration: 3000,
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  };
  