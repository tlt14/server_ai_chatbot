'use strict'
const User = require('../models/User')
const argon2 = require('argon2')
const AuthController = {
  register: async (req, res, next) => {
    console.log(req.body)

    try {
      const { email, password } = req.body
      const checkUser = await User.findOne({ email })
      if (checkUser) {
        res.status(403).json({ error: 'Email already exists' })
      }
      const hashPassword = await argon2.hash(password)
      const newUser = new User({
        email,
        password: hashPassword,
      })
      await newUser.save().then(() => {
        res.status(200).json({ error: 'false', newUser })
      })
      // .catch(() => {
      //   res.json({ error: 'Register Failed' })
      // })
    } catch (error) {
      res.status(400).json({ error: 'Register Failed' })
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(403).json({ error: 'Bạn chưa đăng ký' })
      }
      const checkPassword = await argon2.verify(user.password, password)
      if (!checkPassword) {
        return res.status(403).json({ error: 'Password is incorrect' })
      }
      if (user && checkPassword) {
        // const accessToken = AuthController.generateAccessToken(user);
        //Generate refresh token
        // const refreshToken = AuthController.generateRefreshToken(user);
        //STORE REFRESH TOKEN IN COOKIE

        // res.cookie("refreshToken", refreshToken, {
        //   httpOnly: true,
        //   secure:false,
        //   path: "/",
        //   sameSite: "strict",
        //   expires: new Date(Date.now() +24 * 60 * 60 * 1000 * 1000),
        // });
        const { password, ...others } = user._doc
        // console.log(req.cookies.refreshToken);

        res.status(200).json({ ...others, error: 'false' })
      }
    } catch (error) {
      res.status(500).json('Login Failed')
    }
  },
  delete: async (req, res) => {
    const { email } = req.body
    User.deleteOne({ email })
      .then(() => res.status(200).json('Xóa thành công'))
      .catch((err) => res.status(400).json('error'))
  },
}
module.exports = AuthController
