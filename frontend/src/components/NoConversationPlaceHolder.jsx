import { MessageCircleIcon } from "lucide-react"
export default function NoConversationPlaceHolder() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="size-20 bg-stone-500/20 rounded-full flex items-center justify-center mb-6">
        <MessageCircleIcon className="size-10 text-stone-400" />
      </div>
      <h3 className="text-xl font-semibold text-stone-200 mb-2">
        Select a conversation
      </h3>
      <p className="text-stone-400 max-w-md">
        Choose a contact from the sidebar to start chatting or continue a
        previous conversation.
      </p>
    </div>
  )
}
