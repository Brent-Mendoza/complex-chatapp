import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from "../emails/emailHandler.js"
import "dotenv/config"

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" })
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" })

    const user = await User.findOne({ email: email })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    if (newUser) {
      const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      })
      const savedUser = await newUser.save()

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      res.status(201).json({
        message: "User created successfully",
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
      })

      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          process.env.CLIENT_URL
        )
      } catch (error) {
        console.error(error)
      }
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }

    if (user) return res.status(400).json({ message: "User already exists" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}
