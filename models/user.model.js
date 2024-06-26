// const mongoose = require("mongoose");
// const bcrypt = require('bcrypt')

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   age: {
//     type: Number,
//     require: true,
//   },
//   email: {
//     type: String,
//   },
//   mobile: {
//     type: String,
//   },
//   address: {
//     required: true,
//     type: String,
//   },
//   aadharCardNumber: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     enum: ["voter", "admin"],
//     default: "voter",
//   },
//   isVoted: {
//     type: Boolean,
//     default: false,
//   },
// });


// userSchema.pre("save", async function (next) {
//   const user = this;

//   // Hash the password only if it has been modified or its new
//   if (!user.isModified("password")) return next();

//   try {
//     // creating salt for hashed password
//     const salt = await bcrypt.genSalt(10);

//     // hash password
//     const hashedPassword = await bcrypt.hash(user.password, salt);

//     // Override the plane password with the hashed one
//     user.password = hashedPassword;
//     next();
//   } catch (error) {
//     return next(error);
//   }
// });

// userSchema.methods.comparePassword = async function (candidatePassword) {
//   try {
//     // Use bcrypt to compare The provided password with the hashed password
//     const isMatch = await bcrypt.compare(candidatePassword, this.password);
//     /*
//     compare function automatically extract the salt from the storedPassword and uses it to hash
//     the entered password. then compare the resulting hash with the stored hash. If match then
//     indicated the entered password is correct....
//      */
//     return isMatch;
//   } catch (error) {
//     throw error;
//   }
// };

// const User = mongoose.model('User', userSchema);
// module.exports = User;



const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the Person schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  aadharCardNumber: {
    type: Number,
    required: true,
    unqiue: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const person = this;

  // Hash the password only if it has been modified (or is new)
  if (!person.isModified("password")) return next();
  try {
    // hash password generation
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashedPassword = await bcrypt.hash(person.password, salt);

    // Override the plain password with the hashed one
    person.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;