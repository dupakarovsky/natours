(function (factory) {
   typeof define === 'function' && define.amd ? define(factory) :
   factory();
})((function () { 'use strict';

   //4) IMPORT AXIOS
   // Instead of using the CDN we'll use the imported npm module.
   // import axios from "axios";
   //4.1) goto login.pug and disable the CDN

   // 3) EXPORT ALL FUNCTIONS.
   /*
      Mark login as exportable functions. timeout nad sandDataToAPI dont' need to 
      Move the event listener to index.js
   */

   const login = (email, password) => {
      const apiParams = {
         method: "POST",
         url: `http://127.0.0.1:3000/api/v1/users/login`,
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
            console.log(response);

            if (response.data.status === "success") {
               alert("Logged in successfully!");

               window.setTimeout(() => {
                  location.assign("/");
               }, 1500);
            }
            return response;
         } catch (err) {
            // console.log(err);
            alert(err.response.data.message);
         }
      };

      sendDataToAPI(apiParams);
   };

   // 3.1) goto index.js
   // document.querySelector(".form").addEventListener("submit", (e) => {
   //    e.preventDefault();

   //    const email = document.getElementById("email").value;
   //    const password = document.getElementById("password").value;

   //    login(email, password);
   // });

   // import "leaflet";
   // 5) MARK FUNCTION AS EXPORTEABLE
   /*
      Add a locations paramenter.  Move locations variable on index.js
   */
   const generateMap = function (locations) {
      // Moved to index.js
      // const locations = JSON.parse(document.getElementById("map").dataset.locations);

      const locationsArr = locations.map((location) => {
         return location.coordinates.reverse();
      });

      // DEFINE MAP BOUNDS
      const tourBounds = L.latLngBounds(locationsArr);
      // DEFINE THE MAP
      let map = L.map("map", { closePopupOnClick: false, scrollWheelZoom: false, zoomControl: false }).fitBounds(
         tourBounds,
         {
            padding: [200, 100],
         }
      );
      // DEFINE MAP ICON
      const mapIcon = L.divIcon({ iconSize: [32, 40], className: "marker", iconAnchor: [16, 40], popupAnchor: [0, -25] });
      // ADD A ZOOM CONTROL TO THE AMP
      L.control.zoom().setPosition("topright").addTo(map);

      // PIN EACH MARKER TO THE MAP
      locationsArr.forEach((location, idx) => {
         L.marker(location, { icon: mapIcon })
            .addTo(map)
            .bindPopup(L.popup({ autoClose: false, className: "leaflet-popup--custom" }))
            .setPopupContent(`Day ${locations[idx].day}: ${locations[idx].description}`)
            .openPopup();
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
   };

   // impor the login an the map functions.

   const map = document.querySelector("#map");
   const loginForm = document.querySelector("form");

   // Check if there's a map element on the page. If so, generate the map.
   if (map) {
      // insert the map variable into the parse function.
      const locations = JSON.parse(map.dataset.locations);
      generateMap(locations);
   }

   // Check if there's a form on the page. If so execute the login
   if (loginForm) {
      // replace with the dom variable

      const email = document.getElementById("email");
      const password = document.getElementById("password");

      loginForm.addEventListener("submit", (e) => {
         e.preventDefault();
         login(email.value, password.value);
      });
   }

}));
