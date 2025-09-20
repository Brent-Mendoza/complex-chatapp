import express from "express"
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { arcjetProtection } from "../middleware/arcjet.middleware.js"
import upload from "../middleware/upload.middleware.js"

const router = express.Router()

router.use(arcjetProtection)

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
)

router.get("/check", protectRoute, (req, res) => res.json(req.user))

export default router
