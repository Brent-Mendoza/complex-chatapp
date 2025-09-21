import { MessageCircleIcon } from "lucide-react"

export default function NoHistoryChatPlaceholder({ name }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 bg-gradient-to-br from-stone-500/20 to-stone-400/10 rounded-full flex items-center justify-center mb-5">
        <MessageCircleIcon className="size-8 text-stone-400" />
      </div>
      <h3 className="text-lg font-medium text-stone-200 mb-3">
        Start your conversation with {name}
      </h3>
      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-stone-400 text-sm">
          This is the beginning of your conversation. Send a message to start
          chatting!
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-stone-500/30 to-transparent mx-auto"></div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button className="px-4 py-2 text-xs font-medium text-stone-400 bg-stone-500/10 rounded-full hover:bg-stone-500/20 transition-colors">
          👋 Say Hello
        </button>
        <button className="px-4 py-2 text-xs font-medium text-stone-400 bg-stone-500/10 rounded-full hover:bg-stone-500/20 transition-colors">
          🤝 How are you?
        </button>
        <button className="px-4 py-2 text-xs font-medium text-stone-400 bg-stone-500/10 rounded-full hover:bg-stone-500/20 transition-colors">
          📅 Meet up soon?
        </button>
      </div>
    </div>
  )
}
