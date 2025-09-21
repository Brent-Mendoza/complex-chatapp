import { useChatStore } from "../store/useChatStore"

export default function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore()
  return (
    <div className="tabs tabs-box bg-transparent p-2 m-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab w-1/2 ${
          activeTab === "chats"
            ? "bg-stone-500/20 text-stone-400"
            : "text-stone-400"
        }`}
      >
        Chats
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab w-1/2 ${
          activeTab === "contacts"
            ? "bg-stone-500/20 text-stone-400"
            : "text-stone-400"
        }`}
      >
        Contacts
      </button>
    </div>
  )
}
