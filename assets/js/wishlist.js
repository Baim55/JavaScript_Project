document.addEventListener("DOMContentLoaded", () => {
    let users = JSON.parse(localStorage.getItem("users"))||[];
    let currentUser = users.find((user) => user.isLogined === true);
    let userWishlist = currentUser.wishlist;
  
    function createWishlistItem() {
      userWishlist.forEach((item) => {
        let wishlistItem = document.createElement("div");
        wishlistItem.classList.add("wishlist-item");
  
        let image = document.createElement("div");
        image.classList.add("image");
  
        let img = document.createElement("img");
        img.src = item.image;
        image.appendChild(img);
  
        let title = document.createElement("h5");
        title.classList.add("title");
        title.textContent = item.title.slice(0, 20) + "...";
  
        let category = document.createElement("p");
        category.classList.add("category");
        category.textContent = item.category;
  
        let price = document.createElement("p");
        price.classList.add("price");
        price.textContent = item.price;
  
        let removeBtn = document.createElement("button");
        removeBtn.classList.add("btn", "btn-danger", "remove-btn");
        removeBtn.textContent = "Remove";
  
        removeBtn.addEventListener("click", () => {
          removeWishlistItem(item.id);
        });
  
        wishlistItem.append(image, title, category, price, removeBtn);
  
        let wishlistTag = document.querySelector(".wishlist");
        wishlistTag.appendChild(wishlistItem);
      });
    }
  
    function removeWishlistItem(productId) {
      let userIndex = users.findIndex((user) => user.id == currentUser.id);
      let findProductIndex = currentUser.wishlist.findIndex(
        (product) => product.id == productId
      );
      if (findProductIndex != -1) {
        currentUser.wishlist.splice(findProductIndex, 1);
        users[userIndex] = currentUser;
        localStorage.setItem("users", JSON.stringify(users));
        sweetToast("Product removed from wishlist...");
        window.location.reload()
      }
      currentUser.wishlist;
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
  