const express = require("express");
const router = express.Router();
const User = require("../models/user.model.js");
const { jwtAuthMiddleware, generateToken } = require("../jwt.js");

router.post('/signup', async (req, res) => {
  try {
    const data = req.body;

    // create a new user documnet using mongoose model
    const newUser = new User(data);

    // save the new user to DB
    const addedUser = await newUser.save();
    console.log("Data Saved");

    const payload = {
      id: addedUser.id,
    };

    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log(`Token is : ${token}`);

    res.status(200).json({ addedUser: addedUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/login', async (req, res) => {
  try {
    // Extracting the aadharCardNumber and password from the req body
    const { aadharCardNumber, password } = req.body;

    // finding the user in database using aadharCardNumber
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    const payload = {
      id: user.id,
    };

    const token = generateToken(payload);
    console.log(`Token is : ${token}`);

    // return token as response
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin will watch all user Profies
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user.id;
    const user = await User.find( { id: userId });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put('/profile/password', async (req, res) => {
  try {
    const userId = req.user.id; // Extract the id from the token

    // we need to extract newpass and currpass from the req.body
    const { currentPass, newPass } = req.body;

    if (!currentPass || !newPass) {
      return res
        .status(400)
        .json({ error: "Both currentPassword and newPassword are required" });
    }

    // check that the Is there any data with this uerId in DB, if yes then take it..
    const user = await User.findById(userId);

    if (!user) console.log("Nikal Pakode");

    if (!user || !(await user.comparePassword(currentPass))) {
      return res.status(401).json({ error: "Invalid Username and Password" });
    }

    // Allow Update and Update the user Password
    user.password = newPass;
    await user.save();

    console.log("Password Updated");
    res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;