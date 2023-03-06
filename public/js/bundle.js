var $1n6Zb$mongoose = require("mongoose");
var $1n6Zb$slugify = require("slugify");
var $1n6Zb$validator = require("validator");
var $1n6Zb$bcryptjs = require("bcryptjs");
var $1n6Zb$crypto = require("crypto");

const $cf8ea27b34b2137b$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $cf8ea27b34b2137b$export$de026b00723010c1 = (type, msg, time = 5)=>{
    $cf8ea27b34b2137b$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    setTimeout($cf8ea27b34b2137b$export$516836c6a9dfc573, time * 1000);
}; // return to index.js


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


//4) ADD THE ALERTS MIDDLEWARE
// Here si just set to booking. But we could use this middleware to set up different alert messages by simply chaning the queyry string value
var $271be2bcaa11d14f$export$3a9c49fbc167a8c7;
// now go to index.js to read the data-alert variable in the html and then display it.
// goto index.js
var $271be2bcaa11d14f$export$96591984f736b067;
var $271be2bcaa11d14f$export$95c4b71b6433cd9b;
var $271be2bcaa11d14f$export$754050d979e640b3;
var $271be2bcaa11d14f$export$4f9234baf34abd0;
var $271be2bcaa11d14f$export$904803814e9097f0;
var $271be2bcaa11d14f$export$ca89bc660948fd97;
var $4267ad6bc018d594$exports = {};


const $4267ad6bc018d594$var$tourSchema = new $1n6Zb$mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            "A tour must have a name"
        ],
        unique: true,
        trim: true,
        minlength: [
            10,
            "A tour name must have less or equal to 10 characters"
        ],
        maxlength: [
            40,
            "A tour name must have less or equal to 40 characters"
        ]
    },
    slug: {
        type: String
    },
    duration: {
        type: Number,
        required: [
            true,
            "A tour must have a duration"
        ]
    },
    maxGroupSize: {
        type: Number,
        required: [
            true,
            "A tour must have a group size"
        ]
    },
    difficulty: {
        type: String,
        required: [
            true,
            "A tour must have a difficulty"
        ],
        enum: {
            values: [
                "easy",
                "medium",
                "difficult"
            ],
            message: "Difficulties available are: easy, medium and difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [
            1,
            "Rating must be equal or above 1"
        ],
        max: [
            5,
            "Rating must be equal or below 5"
        ],
        set: function(val) {
            return Math.round(val * 10) / 10;
        }
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [
            true,
            "A price must have a value defined"
        ]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price;
            },
            message: "Discount ({VALUE}) cannot be higher than the price"
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [
            true,
            "A tour must have a description"
        ]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [
            true,
            "A tour must have a cover image"
        ]
    },
    images: [
        String
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [
        Date
    ],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: "Point",
            enum: [
                "Point"
            ]
        },
        coordinates: [
            Number
        ],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: [
                    "Point"
                ]
            },
            coordinates: [
                Number
            ],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: $1n6Zb$mongoose.Schema.ObjectId,
            ref: "User"
        }
    ]
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});
$4267ad6bc018d594$var$tourSchema.index({
    price: 1,
    ratingsAverage: -1
});
$4267ad6bc018d594$var$tourSchema.index({
    slug: 1
});
$4267ad6bc018d594$var$tourSchema.index({
    startLocation: "2dsphere"
});
$4267ad6bc018d594$var$tourSchema.virtual("durationWeeks").get(function() {
    return this.duration / 7;
});
$4267ad6bc018d594$var$tourSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "tour",
    localField: "_id"
});
$4267ad6bc018d594$var$tourSchema.pre("save", function(next) {
    this.slug = $1n6Zb$slugify(this.name, {
        lower: true
    });
    next();
});
$4267ad6bc018d594$var$tourSchema.post("save", function(document, next) {
    // console.log(`${document.name} tour was saved to the database.`);
    next();
});
$4267ad6bc018d594$var$tourSchema.pre(/^find/, function(next) {
    this.startTime = Date.now();
    this.find({
        secretTour: {
            $ne: true
        }
    });
    next();
});
$4267ad6bc018d594$var$tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: "guides",
        select: "-__v -passwordChangedAt"
    });
    next();
});
$4267ad6bc018d594$var$tourSchema.post(/^find/, function(documents, next) {
    // console.log(`Query took ${Date.now() - this.startTime}ms to run`);
    next();
});
$4267ad6bc018d594$var$tourSchema.pre("aggregate", function(next) {
    if (this.pipeline().at(0).$geoNear) next();
    else {
        this.pipeline().unshift({
            $match: {
                secretTour: {
                    $ne: true
                }
            }
        });
        next();
    }
});
const $4267ad6bc018d594$var$Tour = $1n6Zb$mongoose.model("Tour", $4267ad6bc018d594$var$tourSchema);
$4267ad6bc018d594$exports = $4267ad6bc018d594$var$Tour;


var $59bb65767b198347$exports = {};
$59bb65767b198347$exports = function(fn) {
    return (req, res, next)=>{
        fn(req, res, next).catch(next);
    };
};


var $3c05d8eb60b68b8c$exports = {};
class $3c05d8eb60b68b8c$var$AppError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
$3c05d8eb60b68b8c$exports = $3c05d8eb60b68b8c$var$AppError;


var $6ce60ad25e587566$exports = {};




const $6ce60ad25e587566$var$userSchema = new $1n6Zb$mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            "Please tell us your name"
        ],
        trim: true
    },
    email: {
        type: String,
        required: [
            true,
            "Please inform your email address"
        ],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [
            $1n6Zb$validator.isEmail,
            "Please inform a valid email address"
        ]
    },
    photo: {
        type: String,
        trim: true,
        default: "default.jpg"
    },
    role: {
        type: String,
        enum: {
            values: [
                "user",
                "guide",
                "lead-guide",
                "admin"
            ],
            message: "The available roles are: user, guide, lead-guide, admin"
        },
        default: "user"
    },
    password: {
        type: String,
        required: [
            true,
            "A user must have a password set"
        ],
        trim: true,
        minLength: [
            8,
            "Password must have 8 or more characters"
        ],
        maxLength: [
            40,
            "Password must have less than 40 characters"
        ],
        validate: [
            $1n6Zb$validator.isStrongPassword,
            "Must have a min. of 8 chars, 1 or more lowercase, 1 or more uppercase, 1 number, 1 symbol"
        ],
        select: false
    },
    passwordConfirmation: {
        type: String,
        required: [
            true,
            "Please confirm your password"
        ],
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: "Passwords must match"
        }
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpiresAt: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});
$6ce60ad25e587566$var$userSchema.pre(/^find/, function(next) {
    this.find({
        active: {
            $ne: false
        }
    });
    next();
});
$6ce60ad25e587566$var$userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    const hash = await $1n6Zb$bcryptjs.hash(this.password, 12);
    this.password = hash;
    this.passwordConfirmation = undefined;
// console.log("userModel.pre: ", this.password);
});
$6ce60ad25e587566$var$userSchema.pre("save", function(next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
// userSchema.pre("save", function (next) {
//    if (!this.isModified("password")) {
//       return next();
//    }
//    bcrypt
//       .hash(this.password, 12)
//       .then((hash) => {
//          this.password = hash;
//          this.passwordConfirmation = undefined;
//       })
//       .then(() => {
//          console.log("Encryption complete");
//       })
//       .catch((err) => {
//          console.log(err);
//       })
//       .finally(next);
// });
// userSchema.pre("save", function (next) {
//    if (!this.isModified("password") || this.isNew) return next();
//    this.passwordChangedAt = Date.now() - 1000;
//    next();
// });
$6ce60ad25e587566$var$userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    const compareResult = await $1n6Zb$bcryptjs.compare(candidatePassword, userPassword);
    return compareResult;
};
$6ce60ad25e587566$var$userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime(), 10) / 1000;
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
};
$6ce60ad25e587566$var$userSchema.methods.createPasswordResetToken = function() {
    const resetToken = $1n6Zb$crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = $1n6Zb$crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpiresAt = Date.now() + 600000;
    return resetToken;
};
const $6ce60ad25e587566$var$User = $1n6Zb$mongoose.model("User", $6ce60ad25e587566$var$userSchema);
$6ce60ad25e587566$exports = $6ce60ad25e587566$var$User;


var $f17f5242c696cab9$exports = {};

const $f17f5242c696cab9$var$bookingSchema = new $1n6Zb$mongoose.Schema({
    tour: {
        type: $1n6Zb$mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [
            true,
            "Booking must belong to a Tour!"
        ]
    },
    user: {
        type: $1n6Zb$mongoose.Schema.ObjectId,
        ref: "User",
        required: [
            true,
            "Booking must belog to a User!"
        ]
    },
    price: {
        type: Number,
        required: [
            true,
            "Booking must have a price!"
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});
$f17f5242c696cab9$var$bookingSchema.pre(/^find/, function(next) {
    this.populate("user").populate({
        path: "tour",
        select: "name"
    });
    next();
});
const $f17f5242c696cab9$var$Booking = new $1n6Zb$mongoose.model("Booking", $f17f5242c696cab9$var$bookingSchema);
$f17f5242c696cab9$exports = $f17f5242c696cab9$var$Booking;


$271be2bcaa11d14f$export$3a9c49fbc167a8c7 = (req, res, next)=>{
    //4.1) Get the alert valeu from the query string comming from Stripe succes_url
    const alert = req.query.alert;
    if (alert === "booking") //4.2) Add the alert property to the locals object, which will become avaiable in the template
    res.locals.alert = "Your booking was successful. Please check you email for details.";
    next();
};
$271be2bcaa11d14f$export$96591984f736b067 = $59bb65767b198347$exports(async (req, res, next)=>{
    const tours = await $4267ad6bc018d594$exports.find();
    res.status(200).render("overview", {
        title: "All tours",
        tours: tours
    });
});
$271be2bcaa11d14f$export$95c4b71b6433cd9b = $59bb65767b198347$exports(async (req, res, next)=>{
    const tour = await $4267ad6bc018d594$exports.findOne({
        slug: req.params.slug
    }).populate({
        path: "reviews",
        fields: "review rating user"
    });
    if (!tour) return next(new $3c05d8eb60b68b8c$exports("There is no tour with that name", 404));
    res.status(200).render("tour", {
        title: `${tour.name} Tour`,
        tour: tour
    });
});
$271be2bcaa11d14f$export$754050d979e640b3 = (req, res)=>{
    res.status(200).render("login", {
        title: `Login to your account`
    });
};
$271be2bcaa11d14f$export$4f9234baf34abd0 = (req, res)=>{
    res.status(200).render("account", {
        title: "Your account"
    });
};
$271be2bcaa11d14f$export$904803814e9097f0 = $59bb65767b198347$exports(async (req, res)=>{
    const bookings = await $f17f5242c696cab9$exports.find({
        user: req.user.id
    });
    const tourIDs = bookings.map((el)=>el.tour);
    const tours = await $4267ad6bc018d594$exports.find({
        _id: {
            $in: tourIDs
        }
    });
    res.status(200).render("overview", {
        title: "My Tours",
        tours: tours
    });
});
$271be2bcaa11d14f$export$ca89bc660948fd97 = $59bb65767b198347$exports(async (req, res)=>{
    const updatedUser = await $6ce60ad25e587566$exports.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });
    res.status(200).render("account", {
        title: "Your accout",
        user: updatedUser
    });
});



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
// 5.1) Check if alert data property is defined.
const $c74e663a61ed842a$var$alertMessage = document.querySelector("body").dataset.alert;
// if so, execute the showAlert function with the message
if ($c74e663a61ed842a$var$alertMessage) (0, $cf8ea27b34b2137b$export$de026b00723010c1)("success", $c74e663a61ed842a$var$alertMessage); // finaly we'll update the showAlert function to add a default time for the alert to be displayed.
 // goto alerts.js
 // 6) COMPILE, COMMIT AND TEST


//# sourceMappingURL=bundle.js.map
