import { login, logout } from "./login";
import { displayMap } from "./appMap";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";

const map = document.querySelector("#map");
const loginForm = document.querySelector(".form--login");
const userPaswordForm = document.querySelector(".form-user-password");
const userDataForm = document.querySelector(".form-user-data");

const bookBtn = document.querySelector("#book-tour");

if (bookBtn) {
   bookBtn.addEventListener("click", (e) => {
      const { tourId } = e.target.dataset;
      e.target.textContent = "Processing...";
      bookTour(tourId);
   });
}

if (map) {
   const locations = JSON.parse(map.dataset.locations);
   displayMap(locations);
}

if (loginForm) {
   const email = document.getElementById("email");
   const password = document.getElementById("password");

   loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      login(email.value, password.value);
   });
}

const logoutButton = document.querySelector(".nav__el--logout");
if (logoutButton) logoutButton.addEventListener("click", logout);

if (userDataForm)
   userDataForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const form = new FormData();

      form.append("name", document.getElementById("name").value);
      form.append("email", document.getElementById("email").value);
      form.append("photo", document.getElementById("photo").files[0]);

      updateSettings(form, "data");
   });

if (userPaswordForm)
   userPaswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      document.querySelector(".btn--save-password").textContent = "UPDATING...";

      const passwordCurrent = document.getElementById("password-current").value;
      const password = document.getElementById("password").value;
      const passwordConfirmation = document.getElementById("password-confirm").value;

      await updateSettings({ passwordCurrent, password, passwordConfirmation }, "password");

      document.getElementById("password-current").value = "";
      document.getElementById("password").value = "";
      document.getElementById("password-confirm").value = "";

      document.querySelector(".btn--save-password").textContent = "SAVE PASSWORD";
   });
