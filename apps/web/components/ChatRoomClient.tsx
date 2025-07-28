// this is a client side component
// uses the web sockets
// does .json only happen in backend and for frontend you use JSON.parse or JSON.strigify
//this whole thing keeps rerendering
"use client"

import { useEffect, useState } from "react"
import { useSocket } from "../app/hooks/useSocket"

export function ChatRoomClient({
    id,
    messages,
}: {
    id: string
    messages: { message: string }
}) {
    const { socket, loading } = useSocket()
    const [chats, setChats] = useState<string[]>([])
    const [currentMessage, setCurrentMessage] = useState()

    useEffect(() => {
        if (socket && !loading) {
            console.log("control reached till connection" + socket + loading)
            socket.send(
                JSON.stringify({
                    type: "join_room",
                    roomId: id,
                })
            )
            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data)
                if (parsedData.type === "chat") {
                    setChats((prev) => [...prev, parsedData.message])
                }
            }
        }
    }, [])

    {
        console.log("im here ")
    }
    return (
        <div>
            {chats && chats.map((message) => <div key={id}>{message}</div>)}
        </div>
    )
}
