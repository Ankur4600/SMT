const express = require('express');
const User = require("../../Schema/users.schema/users.model")
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config()
const secretCode = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

router.post("/auth/login", async (req, res) => {

  const { email, password } = req.body
  console.log(email, password);
  let user = await User.findOne({ email });
  if (!user) {
    return res.send({
      success: false,
      message: "user not found signup first",
    })
  }
  if (!password || !user.password) {
    return res.send({
      success: false,
      message: "Password missing or user has no password stored",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.send({
      success: false,
      message: "wrong password",
    })
  }

  const data = {
    id: user._id
  }

  const token = await jwt.sign(data, secretCode);
  console.log(token + ". token");
  user.password = ""
  return res.send({
    success: true,
    message: "user logged in successfully",
    token: token,
    data: user,
  })

})

module.exports = router;
