"use client"
import Image, { type ImageProps } from "next/image"
import { Button } from "@repo/ui/button"
import styles from "./page.module.css"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSlug } from "@repo/common/slug"

// user react hook forms here

export default function Home() {
    const [value, setValue] = useState("")
    const router = useRouter()
    return (
        <div>
            <input
                placeholder="Enter room Id here "
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
            ></input>
            <button
                onClick={async () => {
                    const sluggedValue = createSlug(value)
                    router.push(`/room/${sluggedValue}`)
                }}
            >
                Join room
            </button>
        </div>
    )
}
