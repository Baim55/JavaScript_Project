document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = users.find((user) => user.isLogined === true);
  let userIndex = users.findIndex((user) => user.id == currentUser?.id);
  let userBtn = document.querySelector(".username");
  userBtn.textContent = currentUser ? currentUser.username : "Username";
  let basket = currentUser?.basket;
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

  function createWishlistItem() {
    let userWishlist = currentUser?.wishlist || [];

    userWishlist.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-md-12 col-lg-6";

      let card = document.createElement("div");
      card.classList.add("card");
      card.addEventListener("click", () => {
        window.location.href = `product_detail.html?id=${product.id}`;
      });

      let closeIcon = document.createElement("i");
      closeIcon.classList.add("fa-solid", "fa-xmark", "fa-xl");
      closeIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        removeWishlistItem(product.id);
      });

      let cardImage = document.createElement("div");
      cardImage.classList.add("card-image");

      let img = document.createElement("img");
      img.src = product.image;

      let cardContent = document.createElement("div");
      cardContent.classList.add("card-content");

      let cardTitle = document.createElement("p");
      cardTitle.classList.add("card-title");
      cardTitle.textContent = `${product.title.slice(0, 30)}...`;

      let cardFooter = document.createElement("div");
      cardFooter.classList.add("card-footer");

      let cardPrice = document.createElement("span");
      cardPrice.classList.add("card-price");
      cardPrice.textContent = product.price;

      let cardRating = document.createElement("div");
      cardRating.classList.add("card-rating");

      let cardRate = document.createElement("img");
      cardRate.classList.add("card-rate");
      cardRate.src = "assets/images/Group 25546.png";

      let cardReviewsCount = document.createElement("span");
      cardReviewsCount.textContent = product.rating.count;

      let addBtn = document.createElement("button");
      addBtn.classList.add("btn", "add-to-cart");
      addBtn.textContent = "Add to cart";
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addBasket(product.id);
      });

      cardRating.append(cardReviewsCount);
      cardFooter.append(cardPrice, cardRating);
      cardContent.append(cardRate, cardTitle, cardFooter, addBtn);
      cardImage.appendChild(img);
      card.append(closeIcon, cardImage, cardContent);
      col.appendChild(card);

      document.querySelector(".cards").appendChild(col);
    });
  }

  function removeWishlistItem(productId) {
    let findIndex = currentUser.wishlist.findIndex((p) => p.id === productId);
    if (findIndex !== -1) {
      currentUser.wishlist.splice(findIndex, 1);
      users[userIndex] = currentUser;
      localStorage.setItem("users", JSON.stringify(users));
      sweetToast("Product removed from wishlist...");
      window.location.reload();
    }
  }

  const deleteAllBtn = document.querySelector(".deleteAllBtn");
  deleteAllBtn.addEventListener("click", () => {
    currentUser.wishlist = [];
    users[userIndex] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));
    sweetToast("All wishlist items removed");
    window.location.reload();
  });

  function addBasket(productId, products) {
    if (!currentUser) {
      sweetToast("Please log in");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);
      return;
    }

    let basket = currentUser.basket || [];
    let findProduct = basket.find((product) => product.id == productId);

    if (findProduct) {
      findProduct.count++;
    } else {
      let existProduct = products.find((product) => product.id == productId);
      basket.push({ ...existProduct, count: 1 });
    }
    currentUser.basket = basket;
    users[userIndex].basket = basket;
    localStorage.setItem("users", JSON.stringify(users));
    sweetToast("Product added basket successfully...");
    basketCaunt();
  }

  function basketCaunt() {
    let basketItemCount = (basket || []).reduce(
      (acc, product) => acc + product.count,
      0
    );

    let basketCountElem = document.querySelector(".basketIcon sup");
    basketCountElem.textContent = basketItemCount;
  }
  basketCaunt();

  createWishlistItem();
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
