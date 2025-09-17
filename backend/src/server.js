import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"
import messageRouter from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/messages", messageRouter)

app.listen(PORT, () => {
  console.log("Server started on port " + PORT)
  connectDB()
})
