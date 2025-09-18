import jwt from "jsonwebtoken"
import User from "../models/User"

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) return res.status(401).json({ message: "Not authorized" })

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    if (!decoded) return res.status(401).json({ message: "Not authorized" })

    const user = await User.findById(decoded.userId).select("-password")
    if (!user) return res.status(401).json({ message: "Not authorized" })

    req.user = user
    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
