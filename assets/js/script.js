document.addEventListener("DOMContentLoaded", async () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    let currentUser = users.find((user) => user.isLogined == true);
    let userIndex = users.findIndex((user) => user.id == currentUser?.id);
    let userBtn = document.querySelector(".username");
    let basket = currentUser?.basket;
    userBtn.textContent = currentUser ? currentUser.username : "Username";
  
    let login = document.querySelector(".login");
    let register = document.querySelector(".register");
    let logout = document.querySelector(".logout");
  
    let products = await (await fetch("http://localhost:3000/products")).json()
    console.log(products)
  
  
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
  
    function createUserCard() {
        products.forEach((product) => {
          let card = document.createElement("div");
          card.classList.add("card");
          card.addEventListener("click", () => {
            window.location.href = `product_detail.html?id=${product.id}`;
          });
  
          let heartIcon = document.createElement("i");
          heartIcon.classList.add("fa-regular", "fa-heart", "card-heart");
  
          if (
            currentUser &&
            currentUser.wishlist.some((p) => p.id === product.id)
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
              addWishlist(product.id, heartIcon, products);
            }
          });
  
          let cardImage = document.createElement("div");
          cardImage.classList.add("card-image");
  
          let img = document.createElement("img");
          img.src = product.image;
  
          let cardContent = document.createElement("div");
          cardContent.classList.add("card-content");
  
          let cardTitle = document.createElement("h2");
          cardTitle.classList.add("card-title");
          cardTitle.textContent = `${product.title.slice(0, 18)}...`;
  
          let cardCategory = document.createElement("p");
          cardCategory.classList.add("card-category");
          cardCategory.textContent = product.category;
  
          let cardFooter = document.createElement("div");
          cardFooter.classList.add("card-footer");
  
          let cardPrice = document.createElement("span");
          cardPrice.classList.add("card-price");
          cardPrice.textContent = product.price;
  
          let cardRating = document.createElement("div");
          cardRating.classList.add("card-rating");
  
          let cardRate = document.createElement("span");
          cardRate.textContent = product.rating.rate;
  
          let cardReviewsCount = document.createElement("span");
          cardReviewsCount.textContent = product.rating.count;
  
          let addBtn = document.createElement("button");
          addBtn.classList.add("btn", "btn-primary", "add-to-cart");
          addBtn.textContent = "Add Basket";
          addBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            addBasket(product.id, products);
          });
  
          cardRating.append(cardRate, cardReviewsCount);
          cardFooter.append(cardPrice, cardRating);
          cardContent.append(cardTitle, cardCategory, cardFooter, addBtn);
          card.append(heartIcon, cardImage, cardContent);
          cardImage.appendChild(img);
  
          let cards = document.querySelector(".cards");
          cards.appendChild(card);
        });
      };
  
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
  
        currentUser.wishlist.push(newProduct);
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
  
    function addBasket(productId, products) {
      if (!currentUser) {
        sweetToast("Please login to basket");
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
    createUserCard();
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