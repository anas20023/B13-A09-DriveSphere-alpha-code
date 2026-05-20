"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const RegisterPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const validatePassword = (password) => {
        const errors = [];

        if (password.length < 6) {
            errors.push("Password must be at least 6 characters.");
        }

        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter.");
        }

        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter.");
        }

        return errors.join(" ");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setPasswordError("");

        const formData = new FormData(e.currentTarget);

        const name = formData.get("name")?.toString() || "";
        const email = formData.get("email")?.toString() || "";
        const photo = formData.get("photo")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        if (!name || !email || !password) {
            if (!password) {
                setPasswordError("Password is required.");
            }
            toast.error("Please fill in all required fields.");
            return;
        }

        if (name.trim().length < 2) {
            toast.error("Name must be at least 2 characters.");
            return;
        }

        if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {
            toast.error("Please enter a valid email.");
            return;
        }

        if (photo && !/^https?:\/\/.+/i.test(photo)) {
            toast.error("Please enter a valid photo URL.");
            return;
        }

        const nextPasswordError = validatePassword(password);
        if (nextPasswordError) {
            setPasswordError(nextPasswordError);
            toast.error("Please fix the password field.");
            return;
        }

        try {
            setIsSubmitting(true);

            const { data, error } = await authClient.signUp.email({
                name: name,
                email: email,
                password: password,
                image: photo,
                callbackURL: "/",
            });
            // console.log(data)
            if (error) {
                throw new Error(
                    data.message || "Registration failed."
                );
            }
            // toast.success(
            //     "Account created successfully! Redirecting..."
            // );
            localStorage.setItem('sociallogin','true')
            router.push("/login");
        } catch (err) {
            toast.error(
                err.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const data = await authClient.signIn.social({
                provider: "google",
            });
            if(!data){
                throw new Error("Failed to sign-in")
            }
            toast.success("Google Login Successfully");
        } catch (err) {
            toast.error("Google sign-in failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#022c22] via-[#052e16] to-[#020617] px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        Create your account
                    </h1>

                    <p className="mt-3 text-sm text-gray-300">
                        Join DriveSphere and get on the road faster.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleRegister}
                    className="space-y-5"
                >

                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-200">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none transition duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>

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

                    {/* Photo URL */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-200">
                            Photo URL (optional)
                        </label>

                        <input
                            type="url"
                            name="photo"
                            placeholder="https://example.com/photo.jpg"
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
                            onChange={() => setPasswordError("")}
                            aria-invalid={passwordError ? "true" : "false"}
                            aria-describedby={passwordError ? "password-error" : undefined}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none transition duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                        {passwordError ? (
                            <p
                                id="password-error"
                                className="mt-2 text-sm font-medium text-red-300"
                            >
                                {passwordError}
                            </p>
                        ) : null}
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full cursor-pointer rounded-xl bg-emerald-500 py-3 font-semibold text-white transition duration-300 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting
                            ? "Creating account..."
                            : "Register"}
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
                    onClick={handleGoogleSignIn}
                    className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white py-3 font-medium text-gray-900 transition duration-300 hover:bg-gray-100"
                >
                    <FcGoogle className="text-xl" />
                    Continue with Google
                </button>

                {/* Login Link */}
                <p className="mt-7 text-center text-sm text-gray-300">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
