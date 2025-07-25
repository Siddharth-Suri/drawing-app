// this is a server side component
// only uses http requests

async function getChats(roomId: string) {
    const res = await fetch(`http://localhost:3001/chats/${roomId}`)
    const data = await res.json()
    return data.messages
}

export const ChatRoomServer = async ({ id }: { id: string }) => {
    const response = await getChats(id)
}
