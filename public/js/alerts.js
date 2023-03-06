export const hideAlert = () => {
   const el = document.querySelector(".alert");
   if (el) el.parentElement.removeChild(el);
};

// 5) ADD A TIME AND A DEFAULT VALUE
export const showAlert = (type, msg, time = 5) => {
   hideAlert();
   const markup = `<div class="alert alert--${type}">${msg}</div>`;
   document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
   setTimeout(hideAlert, time * 1000);
};
// return to index.js
