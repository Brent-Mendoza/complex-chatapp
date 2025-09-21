import { useChatStore } from "../store/useChatStore"
import { useAuthStore } from "../store/useAuthStore"
import { useEffect } from "react"
import ChatHeader from "./ChatHeader"
import NoHistoryChatPlaceholder from "./NoHistoryChatPlaceholder"
import MessageInput from "./MessageInput"
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton"

export default function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } =
    useChatStore()
  const { authUser } = useAuthStore()

  useEffect(() => {
    getMessagesByUserId(selectedUser?._id)
  }, [selectedUser, getMessagesByUserId])
  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-stone-600 text-white"
                      : "bg-stone-800 text-stone-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoHistoryChatPlaceholder name={selectedUser.fullName} />
        )}
      </div>
      <MessageInput />
    </>
  )
}
