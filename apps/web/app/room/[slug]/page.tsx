const getRoomId = async (value: string) => {
    const res = await fetch(`http://localhost:3001/room/${value}`)
    const roomId = await res.json()
    return roomId.roomId
}

export default async function ChatRoomCreate({
    params,
}: {
    params: { slug: string }
}) {
    const roomId = await getRoomId(params.slug)
}
