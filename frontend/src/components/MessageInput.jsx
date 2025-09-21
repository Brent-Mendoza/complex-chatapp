import { useRef, useState } from "react"
import useKeyboardSound from "../hooks/useKeyboardSound"
import { useChatStore } from "../store/useChatStore"
import { ImageIcon, SendIcon, XIcon } from "lucide-react"

export default function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound()
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState()
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef()

  const { sendMessage, isSoundEnabled } = useChatStore()

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!text.trim() && !imageFile) return
    if (isSoundEnabled) playRandomKeyStrokeSound()

    const formData = new FormData()
    formData.append("text", text.trim())
    if (imageFile) formData.append("image", imageFile)

    sendMessage(formData)

    setText("")
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = null
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = null
  }

  return (
    <div className="p-4 border-t border-stone-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-stone-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center text-stone-200 hover:bg-stone-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex space-x-4"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            isSoundEnabled && playRandomKeyStrokeSound()
          }}
          className="flex-1 bg-stone-800/50 border border-stone-700/50 rounded-lg py-2 px-4 focus:ring-0 focus:outline-0"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-stone-800/50 text-stone-400 hover:text-stone-200 rounded-lg px-4 transition-colors ${
            imagePreview ? "text-stone-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="cursor-pointer bg-gradient-to-r from-stone-500 to-stone-600 text-white rounded-lg px-4 py-2 font-medium hover:from-stone-600 hover:to-stone-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
