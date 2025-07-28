import { ChatRoomServer } from "../../../components/ChatRoomServer"

const getRoomId = async (value: string) => {
    const res = await fetch(`http://localhost:3001/room/${value}`)

    const roomId = await res.json()
    console.log(roomId)
    return roomId.roomId
}

export default async function ChatRoomCreate({
    params,
}: {
    params: { slug: string }
}) {
    const data = await params
    const roomId = await getRoomId(data.slug)
    return <ChatRoomServer id={roomId} />
}
