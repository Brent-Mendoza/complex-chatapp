import { useEffect } from "react"
import { useChatStore } from "../store/useChatStore"
import UsersLoadingSkeleton from "./UsersLoadingSkeleton"

export default function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } =
    useChatStore()

  useEffect(() => {
    getAllContacts()
  }, [getAllContacts])

  if (isUsersLoading) return <UsersLoadingSkeleton />
  return (
    <div>
      {allContacts.map((contacts) => (
        <div
          key={contacts._id}
          className="bg-stone-500/10 p-4 rounded-lg cursor-pointer hover:bg-stone-500/20 transition-colors"
          onClick={() => setSelectedUser(contacts)}
        >
          <div className="flex items-center gap-3">
            <div className="avatar avatar-online">
              <div className="size-12 rounded-full">
                <img
                  src={contacts.profilePic || "/avatar.png"}
                  alt={contacts.fullName}
                />
              </div>
            </div>
            <h4 className="text-stone-200 font-medium truncate">
              {contacts.fullName}
            </h4>
          </div>
        </div>
      ))}
    </div>
  )
}
