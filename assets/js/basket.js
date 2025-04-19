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
        image.appendChild(img);
  
        let title = document.createElement("h6");
        title.classList.add("title");
        title.textContent = product.title;
  
        let category = document.createElement("p");
        category.classList.add("category");
        category.textContent = product.category;
  
        let price = document.createElement("p");
        price.classList.add("price");
        price.textContent = (product.price*product.count).toFixed(2);
  
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
  
        let removeBtn = document.createElement("button");
        removeBtn.classList.add("btn", "btn-danger");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => removeBasketItem(product.id));
  
        countArea.append(minusBtn, countElem, plusBtn);
        basketItem.append(image, title, category, price, countArea, removeBtn);
        basketArea.appendChild(basketItem);
      });
      totalPrice()
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
  
    function increment(productId, countElem, minusBtn , price) {
      let existProduct = basket.find((product) => product.id == productId);
  
      if (existProduct) {
        existProduct.count++;
        countElem.textContent = existProduct.count;
        price.textContent = (existProduct.price * existProduct.count).toFixed(2)
  
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
        price.textContent = (existProduct.price * existProduct.count).toFixed(2)
  
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
  