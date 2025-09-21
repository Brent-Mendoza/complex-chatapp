import { create } from "zustand"
import axiosClient from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

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
      toast.error(
        error?.response?.data?.message ||
          "Something happened. Please try again!"
      )
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosClient.post("/auth/login", data)
      set({ authUser: res.data })
      toast.success("Logged in successfully")
    } catch (error) {
      console.log(error)
      toast.error(
        error?.response?.data?.message ||
          "Something happened. Please try again!"
      )
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosClient.post("/auth/logout")
      toast.success("Logged out successfully")
      set({ authUser: null })
    } catch (error) {
      console.log(error)
      toast.error("Something happened. Please try again later!")
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosClient.put("/auth/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      set({ authUser: res.data })
      toast.success("Profile updated successfully")
    } catch (error) {
      console.log(error)
      toast.error(
        error?.data?.response?.message ||
          "Something happened. Please try again later!"
      )
    } finally {
      set({ isUpdatingProfile: false })
    }
  },
}))
