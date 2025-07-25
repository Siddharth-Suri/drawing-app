import express from "express"
import jwt from "jsonwebtoken"
import { middleware } from "./middleware.js"
import { JWT_SECRET } from "@repo/backend-common/config"
import {
    CreateUserSchema,
    CreateRoomSchema,
    SigninSchema,
} from "@repo/common/types"
import { prismaClient } from "@repo/db/client"
import { createSlug } from "@repo/common/slug"

const app = express()
const port = 3001
const users: any = []

app.use(express.json())

// use hashing bycrypt for passwords

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body)

    if (!parsedData.success) {
        return res
            .status(404)
            .json({ message: "Username or Password are missing" })
    }

    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                //todo : hash the password
                password: parsedData.data.password,
                name: parsedData.data.name,
            },
        })

        res.status(200).json({
            userid: user.id,
        })
    } catch (e) {
        res.status(411).json({
            msg: "Email already exists",
        })
    }
})

app.post("/signin", async (req, res) => {
    const data = SigninSchema.safeParse(req.body)

    if (!data.success) {
        return res
            .status(400)
            .json({ message: "Username or Password are missing" })
    }

    //unhash the password here
    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email: data.data.username,
                password: data.data.password,
            },
        })
        if (!user) {
            res.status(401).json({
                msg: "User doesn't exist",
            })
        } else {
            const token = jwt.sign({ userId: user.id }, JWT_SECRET)
            res.status(200).json({
                token,
            })
        }
    } catch (e) {
        res.status(500).json({
            msg: `Server error `,
        })
    }
})

app.post("/room", middleware, async (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body)

    if (!data.success) {
        return res.status(404).json({ message: "Name is missing" })
    }

    const sluggedName = createSlug(data.data.name)

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: sluggedName,
                //@ts-ignore
                adminId: req.userId,
            },
        })
        res.json({
            roomId: room.id,
        })
    } catch (e) {
        res.json({
            msg: "Server Error while creating room" + e,
        })
    }
})

//now to get past messages of the chat room

app.get("/chats/:roomId", async (req, res) => {
    console.log("connected")
    const roomId = Number(req.params.roomId)
    const exists = await prismaClient.room.findFirst({
        where: {
            id: roomId,
        },
    })
    if (!exists) {
        return res.status(404).json({
            msg: "Room was not found",
        })
    }
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId,
        },
        orderBy: {
            id: "desc",
        },
        take: 50,
    })
    return res.status(200).json({ messages })
})

app.get("/room/:slug", async (req, res) => {
    const slug = createSlug(req.params.slug)
    try {
        const room = await prismaClient.room.findFirst({
            where: {
                slug: slug,
            },
        })
        if (!room || room == null) {
            return res.status(404).json({
                msg: "Room was not found",
            })
        }
        return res.status(200).json({
            roomId: room.id,
        })
    } catch (e) {
        res.status(500).json({
            msg: "Server error while getting roomId",
        })
    }
})

app.listen(port, () => {
    console.log("Started http server: " + port)
})
