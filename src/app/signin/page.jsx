"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await signIn.email({
                email,
                password,
            });

            if (error) {
                setError(error.message || "Invalid email or password.");
                return;
            }

            if (data) {
                toast.success("লগইন সফল হয়েছে!");
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setError("");
        setSocialLoading(provider);

        try {
            await signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch (err) {
            setError("Social login failed. Please try again.");
            setSocialLoading("");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-600 text-white text-3xl shadow-lg mb-4">
                        🛒
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Login to check today's market prices
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-7">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                required
                                autoComplete="email"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    required
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-green-600 px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="relative my-7">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>

                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-sm text-gray-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleSocialLogin("google")}
                        disabled={socialLoading !== ""}
                        className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        <span className="text-lg">G</span>

                        {socialLoading === "google"
                            ? "Connecting..."
                            : "Continue with Google"}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSocialLogin("github")}
                        disabled={socialLoading !== ""}
                        className="w-full mt-3 flex items-center justify-center gap-3 rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-black disabled:opacity-60"
                    >
                        <span className="text-lg">●</span>

                        {socialLoading === "github"
                            ? "Connecting..."
                            : "Continue with GitHub"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-7">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold text-green-600 hover:text-green-700"
                        >
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}