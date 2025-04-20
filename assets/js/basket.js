document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let currentUser = users.find((user) => user.isLogined == true);
  let basket = currentUser.basket || [];
  let userIndex = users.findIndex((user) => user.id == currentUser.id);
  let userBtn = document.querySelector(".username");
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
      deleteAll();
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
    }
  };

  logout.addEventListener("click", logoutUserFunction);

  const deleteAllBtn = document.querySelector(".deleteAllBtn");
  deleteAllBtn.addEventListener("click", deleteAll);

  let confirmCart = document.querySelector(".confirm-card");
      confirmCart.addEventListener("click", () => {
        if (basket.length === 0) {
          sweetToast("Your basket is empty!");
        } else {
          sweetToast("Your order has been confirmed!");
          console.log(basket)
        }
      });

  function createBasketItem() {
    let basketArea = document.querySelector(".basket");
    basketArea.innerHTML = "";

    if (basket.length === 0) {
      deleteAllBtn.style.display = "none";
      basketArea.innerHTML = "<p>Your basket is empty</p>";
    } else {
      deleteAllBtn.style.display = "inline-block";
    }

    basket.forEach((product) => {
      let basketItem = document.createElement("div");
      basketItem.classList.add("basket-item");

      let image = document.createElement("div");
      image.classList.add("image");

      let img = document.createElement("img");
      img.src = product.image;
      image.appendChild(img);

      let titleArea = document.createElement("div");
      titleArea.classList.add("title-area");

      let title = document.createElement("h6");
      title.classList.add("title");
      title.textContent = product.title;

      let price = document.createElement("p");
      price.classList.add("price");
      price.textContent = (product.price * product.count).toFixed(2);

      let countArea = document.createElement("div");
      countArea.classList.add("count-area");

      let minusBtn = document.createElement("button");
      minusBtn.classList.add("minus-btn");
      minusBtn.textContent = "-";
      minusBtn.addEventListener("click", () =>
        decrement(product.id, countElem, minusBtn, price)
      );

      let countElem = document.createElement("p");
      countElem.classList.add("count");
      countElem.textContent = product.count;

      let plusBtn = document.createElement("button");
      plusBtn.classList.add("plus-btn");
      plusBtn.textContent = "+";
      plusBtn.addEventListener("click", () =>
        increment(product.id, countElem, minusBtn, price)
      );

      let favorite = document.createElement("div");
      favorite.classList.add("favorite");

      let heartIcon = document.createElement("i");
      heartIcon.classList.add("fa-regular", "fa-heart", "wish");
      if (
        currentUser &&
        currentUser.wishlist.some((p) => p.id === product.id)
      ) {
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
        heartIcon.style.color = "#DF4244";
      }

      heartIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!currentUser || !currentUser.isLogined) {
          sweetToast("Please log in");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 3000);
        }
      });

      let wishlist = document.createElement("button");
      wishlist.classList.add("wishlistBtn");

      let trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash", "dump");

      let removeBtn = document.createElement("button");
      removeBtn.classList.add("btn-dangerBtn");
      removeBtn.addEventListener("click", () => removeBasketItem(product.id));

      let area = document.createElement("div");
      area.classList.add("area");

      let size = document.createElement("p");
      size.classList.add("size");
      size.innerHTML = `Size: XS<br>Color: Grey<br>Delivery: 25-32 days<br>Quality<br>`;

      let quality = document.createElement("button");
      quality.classList.add("quality");
      quality.innerHTML = `2-9 <i class="fa fa-chevron-right"></i>`;

      area.append(titleArea, size, quality, favorite);
      favorite.append(countArea, wishlist, removeBtn);
      titleArea.append(title, price);
      wishlist.append(heartIcon, "Favorite");
      removeBtn.append(trash, "Remove");
      countArea.append(minusBtn, countElem, plusBtn);
      basketItem.append(image, area);
      basketArea.appendChild(basketItem);
    });
    totalPrice();
  }

  function totalPrice() {
    let payment = basket.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    let totalElem = document.querySelector(".total-price");
    totalElem.textContent = payment.toFixed(2);
  }

  function removeBasketItem(productId) {
    let findProductIndex = basket.findIndex(
      (product) => product.id == productId
    );

    if (findProductIndex != -1) {
      basket.splice(findProductIndex, 1);
      users[userIndex].basket = basket;
      localStorage.setItem("users", JSON.stringify(users));
      sweetToast("Product removed from basket");
    }
    createBasketItem();
    totalPrice();
    basketCaunt();
  }

  function increment(productId, countElem, minusBtn, price) {
    let existProduct = basket.find((product) => product.id == productId);

    if (existProduct) {
      existProduct.count++;
      countElem.textContent = existProduct.count;
      price.textContent = (existProduct.price * existProduct.count).toFixed(2);

      if (existProduct.count > 1) {
        minusBtn.removeAttribute("disabled");
      }

      users[userIndex].basket = basket;
      localStorage.setItem("users", JSON.stringify(users));
      sweetToast("Product added");
    }
    totalPrice();
    basketCaunt();
  }

  function decrement(productId, countElem, minusBtn, price) {
    let existProduct = basket.find((product) => product.id == productId);

    if (existProduct) {
      if (existProduct.count == 1) { 
        minusBtn.setAttribute("disabled", "true");
        return;
      }
  
      existProduct.count--;
      countElem.textContent = existProduct.count;
      price.textContent = (existProduct.price * existProduct.count).toFixed(2)

      users[userIndex].basket = basket;
      localStorage.setItem("users", JSON.stringify(users));
      sweetToast("Product removed");
    }
    totalPrice();
    basketCaunt();
  }

  function deleteAll() {
    basket = [];
    users[userIndex].basket = basket;
    localStorage.setItem("users", JSON.stringify(users));
    createBasketItem();
    totalPrice();
    sweetToast("All products removed from basket");
    basketCaunt();
  }

  function basketCaunt() {
    if (!currentUser || !currentUser.basket) return;

    let basketItemCount = currentUser.basket.reduce(
      (acc, product) => acc + product.count,
      0
    );

    let basketCountElem = document.querySelector(".basketIcon sup");
    if (basketCountElem) {
      basketCountElem.textContent = basketItemCount;
    }
  }
  basketCaunt();
  totalPrice();
  createBasketItem();
});

let sweetToast = (text) => {
  Toastify({
    text: `${text}`,
    duration: 3000,
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
};
