document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let currentUser = users.find((user) => user.isLogined === true);
  let userBtn = document.querySelector(".username");
  let basket = currentUser?.basket;
  userBtn.textContent = currentUser ? currentUser.username : "Username";

  let login = document.querySelector(".login");
  let register = document.querySelector(".register");
  let logout = document.querySelector(".logout");

  if (currentUser) {
    register.classList.add("d-none");
    login.classList.add("d-none");
    logout.classList.remove("d-none");
  } else {
    register.classList.remove("d-none");
    login.classList.remove("d-none");
    logout.classList.add("d-none");
  }

  let logoutUserFunction = () => {
    if (currentUser) {
      currentUser.isLogined = false;
      currentUser.wishlist = [];
      localStorage.setItem("users", JSON.stringify(users));
      userBtn.textContent = "Username";
      logout.classList.add("d-none");
      login.classList.remove("d-none");
      register.classList.remove("d-none");

      let heartIcons = document.querySelectorAll(".card-heart");
      heartIcons.forEach((icon) => {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
      });
      let basketCountElem = document.querySelector(".basketIcon sup");
      if (basketCountElem) {
        basketCountElem.textContent = "0";
      }
      sweetToast("You log out successfully.");
      window.location.reload();
    }
  };

  logout.addEventListener("click", logoutUserFunction);

  const getData = async () => {
    const response = await axios("http://localhost:3000/products");
    let products = response.data;

    const findProduct = products.find((product) => product.id == id);
    console.log(findProduct);
    const productContainer = document.querySelector(".product-container");

    if (!findProduct) {
      productContainer.innerHTML = "<p>Product not found.</p>";
      return;
    }

    productContainer.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-2">
              <div class="thumbnail-slider">
                <i class="fa fa-chevron-up"></i>
              <div class="thumbnails">
                <img src="assets/images/bag2.png" class="thumb active" />
                <img src="assets/images/bag3.png" class="thumb" />
                <img src="assets/images/bag1.png" class="thumb" />
              </div>
                <i class="fa fa-chevron-down"></i>
              </div>
          </div>
          <div class="col-md-10">
            <div class="product-image">
            <img class="img" src="${findProduct.image}" alt="">
            <i class="fa-regular fa-heart card-heart"></i>
          </div>
          </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="product-details">
          <h4 class="product-title">${findProduct.title}</h4>
          <div class="product-rating">
          <img src="assets/images/Group 25546.png">
          <span>${findProduct.rating.rate} | ${findProduct.rating.count} reviews</span>
          </div>
          <div class="pieces">
            <button class="btn-detail">2-9 pieces <span>US $20.00</span></button>
            <button class="btn-detail">10-49 pieces <span>US $20.00</span></button>
            <button class="btn-detail-red">50 pieces <span>US $20.00</span></button>
            <button class="btn-detail">2-9 pieces <span>US $20.00</span></button>
          </div>
          <div class="size-color">
            <div class="sizes">
            <h6>Size</h6>
            <button class="size-xs">XS</button>
            <button class="size">S</button>
            <button class="size">M</button>
          </div>
          <div class="color">
            <h6>Color</h6>
            <label>
              <input type="checkbox">
              <div class="check"><span style="background-color: green;"></span></div>
            </label>
            <label>
                <input type="checkbox">
                <div class="check"><span style="background-color: blue;"></span></div>
            </label>
            <label>
                <input type="checkbox">
                <div class="check"><span style="background-color: yellow;"></span></div>
            </label>
            <label>
                <input type="checkbox">
                <div class="check"><span style="background-color: red;"></span></div>
            </label>
          </div>
          </div>
          <div class="quantity-selector">
          <button class="btn-minus">-</button>
          <input type="number" class="quantity-input" value="1" min="1">
          <button class="btn-plus">+</button>
          </div>
          <button class="btn btn-danger add-to-cart-btn" data-id="${findProduct.id}">Add to Cart</button>
          <button class="btn btn-danger cash-payment-btn">Cash payment</button>
          </div>
          <div class="price">
            <p class="product-price">Price: ${findProduct.price}</p>
          </div>
        </div>
      </div>
      <h4>Product Description</h4>
      <hr>
      <p class="product-description">${findProduct.description}</p>`;

    const thumbs = document.querySelectorAll(".thumb");
    const mainImage = document.querySelector(".product-image .img");
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        document.querySelector(".thumb.active").classList.remove("active");
        thumb.classList.add("active");
        mainImage.src = thumb.src;
      });
    });

    let heartIcon = document.querySelector(".card-heart");
    if (
      currentUser &&
      currentUser.wishlist.some((p) => p.id === findProduct.id)
    ) {
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");
    }

    heartIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!currentUser || !currentUser.isLogined) {
        sweetToast("Please log in");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000);
      } else {
        addWishlist(findProduct.id, heartIcon, products);
      }
    });

    function addWishlist(productId, heartIcon, products) {
      let userIndex = users.findIndex((user) => user.id == currentUser.id);
      let findProductIndex = currentUser.wishlist.findIndex(
        (item) => item.id == productId
      );

      let findProduct = currentUser.wishlist.some(
        (product) => product.id == productId
      );

      if (!findProduct) {
        let newProduct = products.find((product) => product.id == productId);

        currentUser.wishlist.unshift(newProduct);
        sweetToast("Product added to wishlist...");

        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
      } else {
        currentUser.wishlist.splice(findProductIndex, 1);
        sweetToast("Product removed to wishlist...");
        heartIcon.classList.remove("fa-solid");
        heartIcon.classList.add("fa-regular");
      }
      users[userIndex].wishlist = currentUser.wishlist;
      localStorage.setItem("users", JSON.stringify(users));
    }

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

    function addToBasketFromDetails(productId, quantity, products) {
      if (!currentUser) {
        sweetToast("Please login to basket");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000);
        return;
      }

      let userIndex = users.findIndex((user) => user.id === currentUser.id);

      if (userIndex === -1) {
        console.error("Current user not found in users array.");
        return;
      }

      let userBasket = users[userIndex].basket || [];
      let findProductInBasket = userBasket.find(
        (product) => product.id == productId
      );

      if (findProductInBasket) {
        findProductInBasket.count += quantity;
      } else {
        let existProduct = products.find((product) => product.id == productId);
        if (existProduct) {
          userBasket.unshift({ ...existProduct, count: quantity });
        }
      }

      users[userIndex].basket = userBasket;
      localStorage.setItem("users", JSON.stringify(users));

      sweetToast("Product added to basket successfully...");
      window.location.href = "basket.html";
    }
    console.log(response.data);
  };
  function basketCaunt() {
    let basketItemCount = (basket || []).reduce(
      (acc, product) => acc + product.count,
      0
    );

    let basketCountElem = document.querySelector(".basketIcon sup");
    basketCountElem.textContent = basketItemCount;
  }
  basketCaunt();

  getData();
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
