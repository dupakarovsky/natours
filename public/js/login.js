import { showAlert } from "./alerts";

export const login = (email, password) => {
   const apiParams = {
      method: "POST",
      url: `/api/v1/users/login`,
      data: {
         email: email,
         password: password,
      },
   };

   const timeout = function (timer) {
      return new Promise((resolve, reject) => {
         setTimeout(() => {
            reject(new Error("Server took to long to respond!"));
         }, timer * 1000);
      });
   };

   const sendDataToAPI = async function (params) {
      try {
         const postData = axios.request(params);
         const response = await Promise.race([postData, timeout(10)]);
         if (response.statusText !== "OK") throw new Error("Something went wrong!");

         if (response.data.status === "success") {
            showAlert("success", "Logged in successfully!");

            window.setTimeout(() => {
               location.assign("/");
            }, 1500);
         }
         return response;
      } catch (err) {
         showAlert("error", err.response.data.message);
      }
   };

   sendDataToAPI(apiParams);
};

export const logout = async () => {
   const apiParams = {
      method: "GET",
      url: `/api/v1/users/logout`,
   };

   const timeout = function (timer) {
      return new Promise((resolve, reject) => {
         setTimeout(() => {
            reject(new Error("Server took to long to respond!"));
         }, timer * 1000);
      });
   };
   try {
      const getData = axios.request(apiParams);
      const response = await Promise.race([getData, timeout(10)]);

      if (response.statusText !== "OK") throw new Error("Something went wrong! Please try again");

      if (response.data.status === "success") location.reload(true);
   } catch (err) {
      showAlert("error", err);
   }
};
