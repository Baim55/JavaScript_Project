document.addEventListener("DOMContentLoaded", () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    let form = document.querySelector("form");
    let name = document.querySelector("#name");
    let username = document.querySelector("#username");
    let email = document.querySelector("#email");
    let password = document.querySelector("#password");
    let confirmPassword = document.querySelector("#confirmpassword");
    let passwordCheckIcon = document.querySelector("#passwordicon");
  
    form.addEventListener("submit", register);
  
    function register(e) {
      e.preventDefault();
  
      let nameValue = name.value.trim();
      let usernameValue = username.value.trim();
      let emailValue = email.value.trim();
      let passwordValue = password.value.trim();
      let confirmPasswordValue = confirmPassword.value.trim();
  
      if (
        !usernameValue ||
        !emailValue ||
        !passwordValue ||
        !confirmPasswordValue ||
        !name
      ) {
        sweetToast("All fields are required.");
        return;
      }
  
      if (nameValue.length < 3 || nameValue.length > 20) {
        sweetToast("Name must be 3-20 characters.");
        return;
      }
  
      let nameChars = nameValue.split("");
      let isValidName = nameChars.every((char) => {
        return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
      });
  
      if (!isValidName) {
        sweetToast("Name must contain only letters.");
        return;
      }
      // 1) Username - Minimum 3, maksimum 20 simvol; yalnız əlifba, rəqəm, alt xətt və tire istifadə oluna bilər.
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
  
      //2) Email - Düzgün e-poçt formatında olmalıdır (məsələn, user@example.com).
      if (
        !(
          emailValue.endsWith("@gmail.com") ||
          emailValue.endsWith("@yahoo.com") ||
          emailValue.endsWith("@outlook.com") ||
          emailValue.endsWith("@icloud.com") ||
          emailValue.endsWith("@mail.ru") ||
          emailValue.endsWith("@bk.ru") ||
          emailValue.endsWith("@edu.az")
        )
      ) {
        sweetToast(
          "Email must be in the format user@gmail.com, user@yahoo.com, user@mail.ru, etc."
        );
        return;
      }
  
      //3) Sifre Minimum 8 simvol; ən azı bir böyük hərf, bir kiçik hərf, bir rəqəm və bir xüsusi simvol (məsələn, @, #, $, %, &).
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
  
      //4) Sifre-tesdiqi: Qeydiyyat zamanı daxil edilən şifrə ilə uyğun olmalıdır.
      if (passwordValue !== confirmPasswordValue) {
        sweetToast("The password and confirmation password must be the same.");
        return;
      }
  
      //5) Qeydiyyat zamanı daxil edilən istifadəçi adı və e-poçt sistemdə mövcud olmamalıdır. Eyni istifadəçi adı və ya e-poçt ilə qeydiyyat mümkün olmamalıdır.
      let uniqueUser = users.some(
        (user) => user.username === usernameValue || user.email === emailValue
      );
      if (uniqueUser) {
        sweetToast("This username or email already exists.");
        return;
      }
  
      let id = uuidv4();
  
      if (!uniqueUser) {
        let newUser = {
          name: name.value,
          username: username.value,
          email: email.value,
          password: password.value,
          confirmPassword: confirmPassword.value,
          isLogined: false,
          id,
          wishlist: [],
          basket: [],
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        sweetToast("User register successfully...");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000);
      }
    }
  
    //6) İstifadəçi şifrəsi güclü olmalıdır, zəif şifrələr qəbul edilməməlidir.(Sifre guclu oldugu halda yasil check isaresi inputun saginda gorunmelidir eks halda qirmizi gorunmelidir)
    password.addEventListener("input", () => {
      let value = password.value;
      let chars = value.split("");
      let uppercase = chars.some((char) => char >= "A" && char <= "Z");
      let lowercase = chars.some((char) => char >= "a" && char <= "z");
      let digit = chars.some((char) => char >= "0" && char <= "9");
      let specialChar = chars.some(
        (char) =>
          !(char >= "A" && char <= "Z") &&
          !(char >= "a" && char <= "z") &&
          !(char >= "0" && char <= "9")
      );
      if (uppercase && lowercase && digit && specialChar) {
        passwordCheckIcon.textContent = " strong password";
        passwordCheckIcon.className = "fa-solid fa-check valid-icon";
      } else {
        passwordCheckIcon.textContent = " weak password";
        passwordCheckIcon.className = "fa-solid fa-xmark invalid-icon";
      }
    });
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
  