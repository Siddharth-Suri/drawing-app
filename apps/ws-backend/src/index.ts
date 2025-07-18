import { WebSocketServer } from "ws"

const wss = new WebSocketServer({ port: 8080 })
console.log(`Created a port for ws: 8080`)

wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
        ws.send("pong")
    })
})
