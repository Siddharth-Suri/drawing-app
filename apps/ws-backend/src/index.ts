import { WebSocketServer, WebSocket } from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
const wss = new WebSocketServer({ port: 8080 })

console.log(`Created a port for ws: 8080`)

// you can do many things for backend state management and storage
// here i am using a global array which is bad way
// you can use redux and singletons as well

type User = {
    id: String
    ws: WebSocket
    rooms: String[]
}

// for now we iterate through the array and check if people are part of
// rooms and then brodcast them value according to that

// 1. persist things to thee database
// 2. add auth , if you subscribe to room1 you shouldnt be able to send to room2
// 3. you can add queues for async addition of messages to the database , there are a lot of architectures

const usersArray: User[] = []

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        if (
            typeof decoded == "string" ||
            !decoded ||
            !(decoded as JwtPayload).userId
        ) {
            return null
        }
        return decoded.userId
    } catch (e) {
        return null
    }
}

wss.on("connection", function connection(ws, request) {
    const url = request.url

    if (!url) {
        return
    }

    const queryParams = new URLSearchParams(url.split("?")[1])
    const token = queryParams.get("token") || ""
    const userId = checkUser(token)

    if (userId == null) {
        ws.close()
        return null
    }

    usersArray.push({
        id: userId,
        ws,
        rooms: [],
    })

    ws.on("message", function message(data) {
        const parsedData = JSON.parse(data as unknown as string)

        if (parsedData.type == "join_room") {
            const user = usersArray.find((x) => x.ws == ws)
            user?.rooms.push(parsedData.roomId)
        }

        if (parsedData.type == "leave_room") {
            try {
                const user = usersArray.find((x) => x.ws == ws)
                if (!user) return
                user.rooms = user?.rooms.filter((x) => x == parsedData.roomId)
            } catch (e) {
                return
            }
        }

        if (parsedData.type == "chat") {
            const roomId = parsedData.roomId
            const message = parsedData.message

            usersArray.forEach((user) => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(
                        JSON.stringify({
                            type: "chat",
                            message,
                            roomId,
                        })
                    )
                }
            })
        }
    })
})
