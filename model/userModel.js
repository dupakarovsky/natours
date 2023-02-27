const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, "Please tell us your name"],
      trim: true,
   },
   email: {
      type: String,
      required: [true, "Please inform your email address"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please inform a valid email address"],
   },
   photo: {
      type: String,
      trim: true,
      default: "default.jpg",
   },
   role: {
      type: String,
      enum: {
         values: ["user", "guide", "lead-guide", "admin"],
         message: "The available roles are: user, guide, lead-guide, admin",
      },
      default: "user",
   },
   password: {
      type: String,
      required: [true, "A user must have a password set"],
      trim: true,
      minLength: [8, "Password must have 8 or more characters"],
      maxLength: [40, "Password must have less than 40 characters"],
      validate: [
         validator.isStrongPassword,
         "Must have a min. of 8 chars, 1 or more lowercase, 1 or more uppercase, 1 number, 1 symbol",
      ],
      select: false,
   },
   passwordConfirmation: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
         validator: function (val) {
            return val === this.password;
         },
         message: "Passwords must match",
      },
   },
   passwordChangedAt: {
      type: Date,
   },
   passwordResetToken: {
      type: String,
   },
   passwordResetExpiresAt: {
      type: Date,
   },
   active: {
      type: Boolean,
      default: true,
      select: false,
   },
});

userSchema.pre(/^find/, function (next) {
   this.find({ active: { $ne: false } });
   next();
});

userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   const hash = await bcrypt.hash(this.password, 12);
   this.password = hash;
   this.passwordConfirmation = undefined;
   console.log("userModel.pre: ", this.password);
});

userSchema.pre("save", function (next) {
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

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
   const compareResult = await bcrypt.compare(candidatePassword, userPassword);
   return compareResult;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
   if (this.passwordChangedAt) {
      const changedTimeStamp = parseInt(this.passwordChangedAt.getTime(), 10) / 1000;

      return JWTTimestamp < changedTimeStamp;
   }
   return false;
};

userSchema.methods.createPasswordResetToken = function () {
   const resetToken = crypto.randomBytes(32).toString("hex");

   this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

   this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000;

   return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
