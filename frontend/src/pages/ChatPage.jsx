import ChatContainer from "../components/ChatContainer"
import ActiveTabSwitch from "../components/ActiveTabSwitch"
import ChatList from "../components/ChatList"
import ContactList from "../components/ContactList"
import NoConversationPlaceHolder from "../components/NoConversationPlaceHolder"
import ProfileHeader from "../components/ProfileHeader"
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"

export default function ChatPage() {
  const { activeTab, selectedUser } = useChatStore()
  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <div className="w-full h-full flex overflow-hidden rounded-2xl border border-stone-500">
        {/* LEFT SIDE */}
        <div className="w-80 bg-stone-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatList /> : <ContactList />}
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-stone-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceHolder />}
        </div>
      </div>
    </div>
  )
}
