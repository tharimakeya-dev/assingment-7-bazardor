"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await signUp.email({
                name,
                email,
                password,
            });

            if (error) {
                setError(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
                return;
            }

            if (data) {
                toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
                router.push("/signin");
            }
        } catch (err) {
            setError("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setError("");

        try {
            await signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch (err) {
            setError("সোশ্যাল লগইন ব্যর্থ হয়েছে।");
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="text-center mb-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-3xl shadow-lg">
                        🛒
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        অ্যাকাউন্ট তৈরি করুন
                    </h1>

                    <p className="mt-2 text-gray-600">
                        শুরু করার জন্য আপনার অ্যাকাউন্ট তৈরি করুন
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-7 shadow-xl border border-gray-200">

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-bold text-gray-900"
                            >
                                নাম
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="আপনার নাম লিখুন"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError("");
                                }}
                                required
                                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-500 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-bold text-gray-900"
                            >
                                ইমেইল
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="আপনার ইমেইল লিখুন"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                required
                                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-500 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-bold text-gray-900"
                            >
                                পাসওয়ার্ড
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    required
                                    minLength={8}
                                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3.5 pr-12 text-base text-gray-900 placeholder:text-gray-500 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
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

                            <p className="mt-1.5 text-xs text-gray-500">
                                পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে
                            </p>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3">
                                <p className="text-sm font-medium text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-green-600 px-4 py-3.5 font-bold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                                : "অ্যাকাউন্ট তৈরি করুন"}
                        </button>

                    </form>

                    <div className="my-7 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-200" />

                        <span className="text-sm text-gray-500">
                            অথবা
                        </span>

                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <button
                        type="button"
                        onClick={() => handleSocialLogin("google")}
                        className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50"
                    >
                        Google দিয়ে চালিয়ে যান
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSocialLogin("github")}
                        className="mt-3 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-black"
                    >
                        GitHub দিয়ে চালিয়ে যান
                    </button>

                    <p className="mt-7 text-center text-sm text-gray-600">
                        ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}

                        <Link
                            href="/signin"
                            className="font-bold text-green-600 hover:text-green-700"
                        >
                            লগইন করুন
                        </Link>
                    </p>

                </div>
            </div>
        </main>
    );
}