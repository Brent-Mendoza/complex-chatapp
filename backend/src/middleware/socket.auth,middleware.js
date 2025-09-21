import jwt from "jsonwebtoken"
import User from "../models/User.js"
import "dotenv/config"

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1]
    if (!token) return next(new Error("Not authorized"))

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    if (!decoded) return next(new Error("Not authorized"))

    const user = await User.findById(decoded.userId).select("-password")
    if (!user) return next(new Error("Not authorized"))

    socket.user = user
    socket.userId = user._id.toString()
    next()
  } catch (error) {
    console.error(error)
    next(new Error("Not authorized"))
  }
}
