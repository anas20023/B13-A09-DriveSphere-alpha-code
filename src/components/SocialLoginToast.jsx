'use client'

import { useEffect } from "react"
import toast from "react-hot-toast"
const SocialLoginToast = () => {
    useEffect(() => {
        const isSocialLogin = localStorage.getItem("sociallogin")
        if (isSocialLogin) {
            toast.success("Login successful")
            localStorage.removeItem("sociallogin")
        }
    }, [])
    return (
        <>

        </>
    )
}

export default SocialLoginToast