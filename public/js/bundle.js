const $cf8ea27b34b2137b$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $cf8ea27b34b2137b$export$de026b00723010c1 = (type, msg, time = 5)=>{
    $cf8ea27b34b2137b$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    setTimeout($cf8ea27b34b2137b$export$516836c6a9dfc573, time * 1000);
};


const $433b644962c26f49$export$596d806903d1f59e = (email, password)=>{
    const apiParams = {
        method: "POST",
        url: `/api/v1/users/login`,
        data: {
            email: email,
            password: password
        }
    };
    const timeout = function(timer) {
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                reject(new Error("Server took to long to respond!"));
            }, timer * 1000);
        });
    };
    const sendDataToAPI = async function(params) {
        try {
            const postData = axios.request(params);
            const response = await Promise.race([
                postData,
                timeout(10)
            ]);
            if (response.statusText !== "OK") throw new Error("Something went wrong!");
            if (response.data.status === "success") {
                (0, $cf8ea27b34b2137b$export$de026b00723010c1)("success", "Logged in successfully!");
                window.setTimeout(()=>{
                    location.assign("/");
                }, 1500);
            }
            return response;
        } catch (err) {
            (0, $cf8ea27b34b2137b$export$de026b00723010c1)("error", err.response.data.message);
        }
    };
    sendDataToAPI(apiParams);
};
const $433b644962c26f49$export$a0973bcfe11b05c9 = async ()=>{
    const apiParams = {
        method: "GET",
        url: `/api/v1/users/logout`
    };
    const timeout = function(timer) {
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                reject(new Error("Server took to long to respond!"));
            }, timer * 1000);
        });
    };
    try {
        const getData = axios.request(apiParams);
        const response = await Promise.race([
            getData,
            timeout(10)
        ]);
        if (response.statusText !== "OK") throw new Error("Something went wrong! Please try again");
        if (response.data.status === "success") location.reload(true);
    } catch (err) {
        (0, $cf8ea27b34b2137b$export$de026b00723010c1)("error", err);
    }
};


const $b5a84b4736736b3d$export$4c5dd147b21b9176 = function(locations) {
    const locationsArr = locations.map((location)=>{
        return location.coordinates.reverse();
    });
    const tourBounds = L.latLngBounds(locationsArr);
    let map = L.map("map", {
        closePopupOnClick: false,
        scrollWheelZoom: false,
        zoomControl: false
    }).fitBounds(tourBounds, {
        padding: [
            200,
            100
        ]
    });
    const mapIcon = L.divIcon({
        iconSize: [
            32,
            40
        ],
        className: "marker",
        iconAnchor: [
            16,
            40
        ],
        popupAnchor: [
            0,
            -25
        ]
    });
    L.control.zoom().setPosition("topright").addTo(map);
    locationsArr.forEach((location, idx)=>{
        L.marker(location, {
            icon: mapIcon
        }).addTo(map).bindPopup(L.popup({
            autoClose: false,
            className: "leaflet-popup--custom"
        })).setPopupContent(`Day ${locations[idx].day}: ${locations[idx].description}`).openPopup();
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
};



const $6842e7be16478138$export$f558026a994b6051 = async (data, type)=>{
    try {
        const url = type === "data" ? "/api/v1/users/updateMe" : "/api/v1/users/updateMyPassword";
        const response = await axios.request({
            method: "PATCH",
            url: url,
            data: data
        });
        if (response.data.status === "success") (0, $cf8ea27b34b2137b$export$de026b00723010c1)("success", `${type.toUpperCase()} was updated successfuly`);
    } catch (err) {
        (0, $cf8ea27b34b2137b$export$de026b00723010c1)("error", err.response.data.message);
    }
};



const $73e585bd0c7d6b97$export$8d5bdbf26681c0c2 = async (tourId)=>{
    try {
        const stripe = Stripe("pk_test_51MbORHGd3fb1GXN5BnDRNDG7GZ8iBCKOMh8oJMpMxHjOnvw95UozlfoY0tEdebwcPiaBrgqJ8EcuPAUq0ye4E7f100lfZ6e1OL");
        const session = await axios.request({
            method: "GET",
            url: `/api/v1/bookings/checkout-session/${tourId}`
        });
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        (0, $cf8ea27b34b2137b$export$de026b00723010c1)("error", err);
    }
};



const $c74e663a61ed842a$var$map = document.querySelector("#map");
const $c74e663a61ed842a$var$loginForm = document.querySelector(".form--login");
const $c74e663a61ed842a$var$userPaswordForm = document.querySelector(".form-user-password");
const $c74e663a61ed842a$var$userDataForm = document.querySelector(".form-user-data");
const $c74e663a61ed842a$var$bookBtn = document.querySelector("#book-tour");
if ($c74e663a61ed842a$var$bookBtn) $c74e663a61ed842a$var$bookBtn.addEventListener("click", (e)=>{
    const { tourId: tourId  } = e.target.dataset;
    e.target.textContent = "Processing...";
    (0, $73e585bd0c7d6b97$export$8d5bdbf26681c0c2)(tourId);
});
if ($c74e663a61ed842a$var$map) {
    const locations = JSON.parse($c74e663a61ed842a$var$map.dataset.locations);
    (0, $b5a84b4736736b3d$export$4c5dd147b21b9176)(locations);
}
if ($c74e663a61ed842a$var$loginForm) {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    $c74e663a61ed842a$var$loginForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        (0, $433b644962c26f49$export$596d806903d1f59e)(email.value, password.value);
    });
}
const $c74e663a61ed842a$var$logoutButton = document.querySelector(".nav__el--logout");
if ($c74e663a61ed842a$var$logoutButton) $c74e663a61ed842a$var$logoutButton.addEventListener("click", (0, $433b644962c26f49$export$a0973bcfe11b05c9));
if ($c74e663a61ed842a$var$userDataForm) $c74e663a61ed842a$var$userDataForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    (0, $6842e7be16478138$export$f558026a994b6051)(form, "data");
});
if ($c74e663a61ed842a$var$userPaswordForm) $c74e663a61ed842a$var$userPaswordForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "UPDATING...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirmation = document.getElementById("password-confirm").value;
    await (0, $6842e7be16478138$export$f558026a994b6051)({
        passwordCurrent: passwordCurrent,
        password: password,
        passwordConfirmation: passwordConfirmation
    }, "password");
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
    document.querySelector(".btn--save-password").textContent = "SAVE PASSWORD";
});
const $c74e663a61ed842a$var$alertMessage = document.querySelector("body").dataset.alert;
if ($c74e663a61ed842a$var$alertMessage) (0, $cf8ea27b34b2137b$export$de026b00723010c1)("success", $c74e663a61ed842a$var$alertMessage);


//# sourceMappingURL=bundle.js.map
