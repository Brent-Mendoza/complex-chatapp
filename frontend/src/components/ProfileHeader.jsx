import { useRef, useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"
import {
  LoaderIcon,
  LogOutIcon,
  Volume2Icon,
  VolumeOffIcon,
} from "lucide-react"

const mouseClickSound = new Audio("/sounds/mouse-click.mp3")

export default function ProfileHeader() {
  const { logout, authUser, updateProfile, isUpdatingProfile } = useAuthStore()
  const { isSoundEnabled, toggleSound } = useChatStore()
  const [selectedImg, setSelectedImg] = useState(null)
  const fileInputRef = useRef(null)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedImg(URL.createObjectURL(file)) // just for preview

    const formData = new FormData()
    formData.append("profilePic", file)

    await updateProfile(formData)
  }

  return (
    <div className="p-6 border-b border-stone-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar avatar-online">
            <button
              className="size-14 rounded-full overflow-hidden relative group cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {isUpdatingProfile ? (
                <LoaderIcon className="size-5 animate-spin" />
              ) : (
                <>
                  <img
                    src={selectedImg || authUser.profilePic || "/avatar.png"}
                    alt="User Image"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs">Change</span>
                  </div>
                </>
              )}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-stone-200 font-medium text-base max-w-[100px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-stone-400 text-xs">Online</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            className="text-stone-400 hover:text-stone-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>
          <button
            className="text-stone-400 hover:text-stone-200 transition-colors"
            onClick={() => {
              mouseClickSound.currentTime = 0
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error))
              toggleSound()
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
