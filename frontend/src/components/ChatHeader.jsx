import { XIcon } from "lucide-react"
import { useChatStore } from "../store/useChatStore"
import { useEffect } from "react"
import { useAuthStore } from "../store/useAuthStore"

export default function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("keydown", handleKey)
    }
  }, [setSelectedUser])
  return (
    <div className="flex justify-between items-center bg-stone-800/50 border-b border-stone-700/50 max-h-[84px] p-6 flex-1">
      <div className="flex items-center space-x-3">
        <div
          className={`avatar ${
            onlineUsers.includes(selectedUser._id)
              ? "avatar-online"
              : "avatar-offline"
          } `}
        >
          <div className="w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>
        <div>
          <h3 className="text-stone-200 font-medium">
            {selectedUser.fullName}
          </h3>
          <p className="text-stone-400 text-sm">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer" />
      </button>
    </div>
  )
}
