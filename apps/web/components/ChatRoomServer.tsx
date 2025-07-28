// this is a server side component
// only uses http requests

import { ChatRoomClient } from "./ChatRoomClient"

async function getChats(roomId: string) {
    console.log("control reached to fetch prev chats")
    const res = await fetch(`http://localhost:3001/chats/${roomId}`)
    const data = await res.json()
    return data.messages
}

export const ChatRoomServer = async ({ id }: { id: string }) => {
    const response = await getChats(id)
    return <ChatRoomClient id={id} messages={response}></ChatRoomClient>
}
