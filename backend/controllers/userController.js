const User = require("../models/User");

const createUser = async (req, res) => {
  const { user } = req.body;
  console.log(user);
  try {
    const newUser = new User({
      firebaseId: user.uid,
      email: user.email,
    });
    await newUser.save();

    res.status(200).send("User Created");
  } catch (err) {
    console.log("Error: Cannot Create User");
    res.status(500).send(err.message);
  }
};
module.exports = {
  createUser,
};
