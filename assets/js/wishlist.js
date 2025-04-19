document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users"))||[];
  let currentUser = users.find((user) => user.isLogined === true);
  let userWishlist = currentUser.wishlist;
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
  function createWishlistItem() {
    userWishlist.forEach((product) => {

      const col = document.createElement("div");
      col.className = "col-md-12 col-lg-6";

      let card = document.createElement("div");
      card.classList.add("card");
      card.addEventListener("click", () => {
        window.location.href = `product_detail.html?id=${product.id}`;
      });

      let heartIcon = document.createElement("i");
      heartIcon.classList.add("fa-solid", "fa-xmark", "fa-xl");

      let wishlistItem = document.createElement("div");
      wishlistItem.classList.add("wishlist-item");

      let cardImage = document.createElement("div");
      cardImage.classList.add("card-image");

      let img = document.createElement("img");
      img.src = product.image;

      let cardContent = document.createElement("div");
      cardContent.classList.add("card-content");

      let cardTitle = document.createElement("p");
      cardTitle.classList.add("card-title");
      cardTitle.textContent = product.title;

      let cardFooter = document.createElement("div");
      cardFooter.classList.add("card-footer");

      let cardPrice = document.createElement("span");
      cardPrice.classList.add("card-price");
      cardPrice.textContent = product.price;

      let cardRating = document.createElement("div");
      cardRating.classList.add("card-rating");

      let cardRate = document.createElement("img");
      cardRate.classList.add("card-rate");
      cardRate.textContent = product.rating.rate;
      cardRate.src = "assets/images/Group 25546.png";

      let cardReviewsCount = document.createElement("span");
      cardReviewsCount.textContent = product.rating.count;

      let addBtn = document.createElement("button");
      addBtn.classList.add("btn", "add-to-cart");
      addBtn.textContent = "Add to card";
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addBasket(product.id, products);
      });

      cardRating.append(cardReviewsCount);
      cardFooter.append(cardPrice, cardRating);
      cardContent.append(cardRate, cardTitle, cardFooter, addBtn);
      card.append(heartIcon, cardImage, cardContent);
      cardImage.appendChild(img);

      let cards = document.querySelector(".cards");
      cards.appendChild(col);
      col.appendChild(card);
    });
  }

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
