import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getCars = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cars`)
        if (!res.ok) {
            throw new Error('Failed to fetch cars');
        }
        return res.json()
    } catch (error) {
        console.log(error.message)
        return []
    }
}
export const getCarsByID = async (id) => {
    const { token } = await auth.api.getToken({
        headers: await headers()
    })
    // console.log(token)
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cars/${id}`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
        if (!res.ok) {
            throw new Error('Failed to fetch car');
        }
        return res.json()
    } catch (error) {
        console.log(error.message)
        return {}
    }
}
export const getBookings = async () => {
    const { token } = await auth.api.getToken({
        headers: await headers()
    })
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
        if (!res.ok) {
            throw new Error('Failed to fetch cars');
        }
        return res.json()
    } catch (error) {
        console.log(error.message)
        return []
    }
}