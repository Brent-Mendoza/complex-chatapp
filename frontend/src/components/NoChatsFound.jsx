import { MessageCircleIcon } from "lucide-react"
import { useChatStore } from "../store/useChatStore"

export default function NoChatsFound() {
  const { setActiveTab } = useChatStore()
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-stone-500/10 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-8 h-8 text-stone-400" />
      </div>
      <div>
        <h4 className="text-stone-200 font-medium mb-1">
          No conversations yet
        </h4>
        <p className="text-stone-400 text-sm px-6">
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="px-4 py-2 text-sm text-stone-400 bg-stone-500/10 rounded-lg hover:bg-stone-500/20 transition-colors cursor-pointer"
      >
        Find contacts
      </button>
    </div>
  )
}
