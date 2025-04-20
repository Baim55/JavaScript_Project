document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let currentUser = users.find((user) => user.isLogined == true);
  let basket = currentUser.basket || [];
  let userIndex = users.findIndex((user) => user.id == currentUser.id);

  const deleteAllBtn = document.querySelector(".deleteAllBtn");
  deleteAllBtn.addEventListener("click", deleteAll);

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
      image.appendChild(img)

      let titleArea = document.createElement("div")
      titleArea.classList.add("title-area")

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

      let favorite=document.createElement("div")
      favorite.classList.add("favorite")

      let heart = document.createElement("i");
      heart.classList.add("fa-regular","fa-heart","wish");

      let wishlist = document.createElement("button");
      wishlist.classList.add("wishlistBtn");

      let trash = document.createElement("i");
      trash.classList.add("fa-solid","fa-trash","dump");

      let removeBtn = document.createElement("button");
      removeBtn.classList.add("btn-dangerBtn");
      removeBtn.addEventListener("click", () => removeBasketItem(product.id));

      let area=document.createElement("div")
      area.classList.add("area")

      let size = document.createElement("p")
      size.classList.add("size")
      size.innerHTML = `Size: XS<br>Color: Grey<br>Delivery: 25-32 days<br>Quality`
      
      area.append(titleArea,size,favorite)
      favorite.append(countArea,wishlist, removeBtn)
      titleArea.append(title,price)
      wishlist.append(heart,"Favorite")
      removeBtn.append(trash,"Remove")
      countArea.append(minusBtn, countElem, plusBtn);
      basketItem.append(image,area);
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
  }

  function decrement(productId, countElem, minusBtn, price) {
    let existProduct = basket.find((product) => product.id == productId);

    if (existProduct) {
      existProduct.count--;
      countElem.textContent = existProduct.count;
      price.textContent = (existProduct.price * existProduct.count).toFixed(2);

      if (existProduct.count == 1) {
        minusBtn.setAttribute("disabled", "true");
      }

      users[userIndex].basket = basket;
      localStorage.setItem("users", JSON.stringify(users));
      sweetToast("Product removed");
    }
    totalPrice();
  }

  function deleteAll() {
    basket = [];
    users[userIndex].basket = basket;
    localStorage.setItem("users", JSON.stringify(users));
    createBasketItem();
    totalPrice();
    sweetToast("All products removed from basket");
  }

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
