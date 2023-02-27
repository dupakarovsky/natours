export const displayMap = function (locations) {
   const locationsArr = locations.map((location) => {
      return location.coordinates.reverse();
   });

   const tourBounds = L.latLngBounds(locationsArr);
   let map = L.map("map", { closePopupOnClick: false, scrollWheelZoom: false, zoomControl: false }).fitBounds(
      tourBounds,
      {
         padding: [200, 100],
      }
   );
   const mapIcon = L.divIcon({ iconSize: [32, 40], className: "marker", iconAnchor: [16, 40], popupAnchor: [0, -25] });
   L.control.zoom().setPosition("topright").addTo(map);

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
