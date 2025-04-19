document.addEventListener("DOMContentLoaded", () => {
    let users = JSON.parse(localStorage.getItem("users"))||[];
  
    let form = document.querySelector("form");
    form.addEventListener("submit", login);
    let username = document.querySelector("#username");
    let password = document.querySelector("#password");
    let errorMessage = document.querySelector("#errorMessage");
  
    let failedAttempts = JSON.parse(localStorage.getItem("failedAttempts")) || 0;
    let blockTime = JSON.parse(localStorage.getItem("blockTime")) || null;
  
    if (blockTime && new Date().getTime() < blockTime) {
      let remainingTime = Math.ceil((blockTime - new Date().getTime()) / 1000);
      errorMessage.textContent = `Your account is locked. Try again in ${remainingTime} seconds.`;
      form.querySelector("button").disabled = true;
      return;
    } else {
      localStorage.removeItem("failedAttempts");
      localStorage.removeItem("blockTime");
    }
  
    function login(e) {
      e.preventDefault();
  
      let usernameValue = username.value.trim();
      let passwordValue = password.value.trim();
  
      if (usernameValue.length < 3 || usernameValue.length > 20) {
        sweetToast("Username must be 3-20 characters.");
        return;
      }
  
      let usernameChars = usernameValue.split("");
      let isValidUsername = usernameChars.every((char) => {
        return (
          (char >= "a" && char <= "z") ||
          (char >= "A" && char <= "Z") ||
          (char >= "0" && char <= "9") ||
          char === "_" ||
          char === "-"
        );
      });
  
      if (!isValidUsername) {
        sweetToast(
          "Username must contain only letters, numbers, _ and - characters."
        );
        return;
      }
  
      if (passwordValue.length < 8) {
        sweetToast("Password must be at least 8 characters long.");
        return;
      }
  
      let chars = passwordValue.split("");
      let uppercase = chars.some((char) => char >= "A" && char <= "Z");
      let lowercase = chars.some((char) => char >= "a" && char <= "z");
      let digit = chars.some((char) => char >= "0" && char <= "9");
      let specialChar = chars.some((char) => {
        return (
          !(char >= "A" && char <= "Z") &&
          !(char >= "a" && char <= "z") &&
          !(char >= "0" && char <= "9")
        );
      });
  
      if (!uppercase || !lowercase || !digit || !specialChar) {
        sweetToast(
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
        );
        return;
      }
  
      let loginedUser = users.find(
        (user) =>
          user.username == username.value && user.password == password.value
      );
  
      if (loginedUser) {
        loginedUser.isLogined = true;
        localStorage.setItem("users", JSON.stringify(users));
        sweetToast("User login successfully...");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 3000);
        localStorage.removeItem("failedAttempts");
      } else {
        failedAttempts++;
  
        if (failedAttempts >= 3) {
          blockTime = new Date().getTime() + 1 * 60 * 1000;
          localStorage.setItem("blockTime", blockTime);
          errorMessage.textContent =
            "Your account is temporarily locked due to multiple failed login attempts. Try again in 1 minutes.";
          form.querySelector("button").disabled = true;
        } else {
          errorMessage.textContent = `Incorrect username or password. You have ${
            3 - failedAttempts
          } attempts left.`;
        }
  
        localStorage.setItem("failedAttempts", JSON.stringify(failedAttempts));
  
        username.value = "";
        password.value = "";
      }
    }
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
  