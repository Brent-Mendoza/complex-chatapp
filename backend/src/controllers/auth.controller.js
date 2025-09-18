import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from "../emails/emailHandler.js"
import "dotenv/config"
import cloudinary from "../lib/cloudinary.js"

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

    if (user) return res.status(400).json({ message: "User already exists" })

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
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ message: "Please fill all the fields" })

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid Credentials" })

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" })

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    })
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.status(201).json({
      message: "User created successfully",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const logout = async (_, res) => {
  res.cookies("jwt", "", { maxAge: 0 })
  res.status(200).json({ message: "User logged out successfully" })
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    if (!profilePic)
      return res
        .status(400)
        .json({ message: "Please upload a profile picture" })
    const user = req.user._id

    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(
      user,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password")

    res
      .status(200)
      .json({
        message: "Profile picture updated successfully",
        user: updatedUser,
      })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}
