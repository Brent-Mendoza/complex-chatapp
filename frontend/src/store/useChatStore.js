import { create } from "zustand"
import axiosClient from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
    set({ isSoundEnabled: !get().isSoundEnabled })
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  getAllContacts: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosClient.get("/messages/contacts")
      set({ allContacts: res.data })
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something happened. Please try again!"
      )
    } finally {
      set({ isUsersLoading: false })
    }
  },
  getMyChatPartners: async () => {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosClient.get("/messages/chats")
      set({ chats: res.data })
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something happened. Please try again!"
      )
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosClient.get(`/messages/${userId}`)
      set({ messages: res.data })
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something happened. Please try again!"
      )
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get()
    const { authUser } = useAuthStore.getState()

    const tempId = `temp-${Date.now()}`

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    }
    set({ messages: [...messages, optimisticMessage] })
    try {
      const res = await axiosClient.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      set({ messages: messages.concat(res.data) })
    } catch (error) {
      set({ messages: messages })
      toast.error(
        error?.response?.data?.message ||
          "Something happened. Please try again!"
      )
    }
  },

  subscribeToMessage: () => {
    const { selectedUser, isSoundEnabled } = get()
    if (!selectedUser) return

    const socket = useAuthStore.getState().socket

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id
      if (!isMessageSentFromSelectedUser) return
      const currentMessages = get().messages
      set({ messages: [...currentMessages, newMessage] })

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3")
        notificationSound.currentTime = 0
        notificationSound.play().catch((error) => console.log(error))
      }
    })
  },

  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")
  },
}))
