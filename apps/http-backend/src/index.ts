import express from "express"
import * as jwt from "jsonwebtoken"
import { middleware } from "./middleware.js"
import { JWT_SECRET } from "@repo/backend-common/config"
import {
    CreateUserSchema,
    CreateRoomSchema,
    SigninSchema,
} from "@repo/common/types"
const app = express()
const port = 3000
const users: any = []

app.use(express.json())

app.post("/signup", (req, res) => {
    const data = CreateUserSchema.safeParse(req.body)

    if (!data.success) {
        return res
            .status(404)
            .json({ message: "Username or Password are missing" })
    }

    // db call here

    res.status(200).json({
        userid: 123,
    })
})

app.post("/signin", (req, res) => {
    const userId = 1
    const data = SigninSchema.safeParse(req.body)

    if (!data.success) {
        return res
            .status(404)
            .json({ message: "Username or Password are missing" })
    }

    const token = jwt.sign({ userId }, JWT_SECRET)
    res.json({
        token,
    })
})

app.post("/room", middleware, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body)

    if (!data.success) {
        return res
            .status(404)
            .json({ message: "Username or Password are missing" })
    }

    res.json({
        roomId: 123,
    })
})

app.listen(port, () => {
    console.log("Started http server: " + port)
})
