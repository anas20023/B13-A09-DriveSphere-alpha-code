"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            setIsSubmitting(true);

            // Example API request
            const { data, error } = await authClient.signIn.email({
                email: email,
                password: password,
                rememberMe: true,
                callbackURL: "/",
            });

            if (error) {
                throw new Error(
                    data.message || "Login failed."
                );
            }
            toast.success("Login successful!");
            router.push("/");
        } catch (err) {
            toast.error(
                err.message ||
                "Invalid email or password."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const data = await authClient.signIn.social({
                provider: "google",
            });
            if (!data) {
                throw new Error("Failed to sign-in")
            }
            // toast.success("Google login successful!");
            localStorage.setItem('sociallogin','true')
            router.push("/");
        } catch (err) {
            toast.error("Google login failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#022c22] via-[#052e16] to-[#020617] px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        Welcome Back
                    </h1>

                    <p className="mt-3 text-sm text-gray-300">
                        Login to continue your journey with DriveSphere.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-200">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none transition duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-200">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none transition duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full cursor-pointer rounded-xl bg-emerald-500 py-3 font-semibold text-white transition duration-300 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10"></div>

                    <span className="text-xs uppercase tracking-wider text-gray-400">
                        Or continue with
                    </span>

                    <div className="h-px flex-1 bg-white/10"></div>
                </div>

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    className="flex cursor-pointer w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-medium text-gray-900 transition duration-300 hover:bg-gray-100"
                >
                    <FcGoogle className="text-xl" />
                    Continue with Google
                </button>

                {/* Register Link */}
                <p className="mt-7 text-center text-sm text-gray-300">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;