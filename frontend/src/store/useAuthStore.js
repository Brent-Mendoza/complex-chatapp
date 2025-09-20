import { create } from "zustand"
import axiosClient from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,

  checkAuth: async () => {
    try {
      const res = await axiosClient.get("/auth/check")
      set({ authUser: res.data, isCheckingAuth: false })
    } catch (error) {
      console.log(error)
      set({ authUser: null, isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosClient.post("/auth/signup", data)
      set({ authUser: res.data })
      toast.success("Account created successfully")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  },
}))
