
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toBanglaNumber } from "../../components/priceUtils";
import ProductAuthGuard from "../../components/ProductAuthGuard";

const API_URL = "/api/products";

// পণ্যের নিজস্ব emoji
function getProductIcon(product) {
    const name = String(product?.nameBn || product?.name || "").trim();

    if (name.includes("আদা")) return "🫚";
    if (name.includes("পেঁয়াজ") || name.includes("পেঁয়াজ")) return "🧅";
    if (name.includes("আলু")) return "🥔";
    if (name.includes("রসুন")) return "🧄";
    if (name.includes("টমেটো")) return "🍅";
    if (name.includes("বেগুন")) return "🍆";
    if (name.includes("মরিচ")) return "🌶️";
    if (name.includes("লেবু")) return "🍋";
    if (name.includes("কলা")) return "🍌";
    if (name.includes("মাছ")) return "🐟";
    if (name.includes("ডিম")) return "🥚";
    if (name.includes("মুরগি")) return "🍗";
    if (name.includes("গরুর মাংস")) return "🥩";

    if (typeof product?.image === "string" && product.image.trim()) {
        return product.image.trim();
    }

    const categoryIcons = {
        chal: "🍚",
        dal: "🫘",
        tel: "🫙",
        sobji: "🥬",
        mach: "🐟",
        mangsho: "🍗",
        mosla: "🌶️",
        dim: "🥚",
    };

    return categoryIcons[product?.category] || "🛒";
}

function ProductDetails() {
    const params = useParams();
    const slug = params?.slug;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!slug) return;

        const controller = new AbortController();

        async function fetchProduct() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(API_URL, {
                    signal: controller.signal,
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
                }

                const result = await response.json();

                const products = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.products)
                        ? result.products
                        : Array.isArray(result?.data)
                            ? result.data
                            : Array.isArray(result?.data?.products)
                                ? result.data.products
                                : [];

                const foundProduct = products.find(
                    (item) =>
                        String(item.slug).toLowerCase() ===
                        String(slug).toLowerCase()
                );

                if (!foundProduct) {
                    throw new Error("এই পণ্যটি খুঁজে পাওয়া যায়নি।");
                }

                setProduct(foundProduct);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "আবার চেষ্টা করো।");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchProduct();

        return () => controller.abort();
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-12">
                <div className="mx-auto max-w-4xl animate-pulse rounded-2xl bg-white p-8 shadow-sm">
                    <div className="mb-6 h-8 w-48 rounded bg-gray-200" />
                    <div className="mb-4 h-20 w-20 rounded-full bg-gray-200" />
                    <div className="mb-3 h-6 w-40 rounded bg-gray-200" />
                    <div className="h-10 w-56 rounded bg-gray-200" />
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
                    <div className="mb-3 text-5xl">😕</div>
                    <h1 className="mb-2 text-xl font-bold text-gray-800">
                        পণ্য পাওয়া যায়নি
                    </h1>
                    <p className="mb-6 text-sm text-gray-500">
                        {error || "পণ্যের তথ্য পাওয়া যায়নি।"}
                    </p>
                    <Link
                        href="/"
                        className="inline-flex rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                    >
                        ← হোম পেজে ফিরে যাও
                    </Link>
                </div>
            </main>
        );
    }

    const productIcon = getProductIcon(product);
    const today = Number(product.today ?? 0);
    const yesterday = Number(product.yesterday ?? 0);
    const lastWeek = Number(product.lastWeek ?? 0);
    const lastMonth = Number(product.lastMonth ?? 0);
    const unit = product.unit || "kg";

    const markets = Array.isArray(product.markets)
        ? product.markets
        : [];

    const marketPrices = markets
        .flatMap((market) => [
            Number(market.min),
            Number(market.max),
        ])
        .filter((price) => Number.isFinite(price) && price > 0);

    const minPrice =
        marketPrices.length > 0 ? Math.min(...marketPrices) : today;

    const maxPrice =
        marketPrices.length > 0 ? Math.max(...marketPrices) : today;

    const averagePrice =
        marketPrices.length > 0
            ? marketPrices.reduce((sum, price) => sum + price, 0) /
            marketPrices.length
            : today;

    const changePercent =
        product.change?.pct ??
        (yesterday > 0
            ? Math.round(((today - yesterday) / yesterday) * 100)
            : 0);

    const isUp =
        product.change?.dir === "up" ||
        (product.change?.dir !== "down" && today > yesterday);

    const formatPrice = (price) =>
        `${toBanglaNumber(Math.round(price))} ৳`;

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                >
                    ← সব পণ্যে ফিরে যাও
                </Link>

                {/* Product header */}
                <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 px-6 py-8 text-white sm:px-10 sm:py-10">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white text-6xl shadow-lg">
                                {productIcon}
                            </div>

                            <div>
                                <p className="mb-2 text-sm text-green-100">
                                    {product.categoryNameBn || "বাজারদর"}
                                </p>
                                <h1 className="text-3xl font-extrabold sm:text-4xl">
                                    {product.nameBn || product.name || "পণ্য"}
                                </h1>
                                <p className="mt-2 text-sm text-green-50">
                                    প্রতি {unit} এর বাজারদর
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
                        <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
                            <p className="text-sm font-medium text-gray-600">
                                আজকের দাম
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-green-700 sm:text-4xl">
                                {formatPrice(today)}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                প্রতি {unit}
                            </p>
                        </div>

                        <div
                            className={`rounded-2xl border p-6 ${isUp
                                    ? "border-red-100 bg-red-50"
                                    : "border-blue-100 bg-blue-50"
                                }`}
                        >
                            <p className="text-sm font-medium text-gray-600">
                                গতকালের তুলনায়
                            </p>
                            <p
                                className={`mt-2 text-3xl font-extrabold ${isUp ? "text-red-600" : "text-blue-600"
                                    }`}
                            >
                                {isUp ? "↑" : "↓"}{" "}
                                {toBanglaNumber(
                                    Math.abs(Number(changePercent))
                                )}%
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                গতকাল: {formatPrice(yesterday)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Price summary */}
                <section className="mt-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-800">
                        📊 দামের সংক্ষিপ্ত বিবরণ
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
                            <p className="mt-2 text-2xl font-bold text-green-700">
                                {formatPrice(minPrice)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
                            <p className="mt-2 text-2xl font-bold text-red-600">
                                {formatPrice(maxPrice)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">গড় দাম</p>
                            <p className="mt-2 text-2xl font-bold text-blue-700">
                                {formatPrice(averagePrice)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Historical prices */}
                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-800">
                        🗓️ আগের দামের তথ্য
                    </h2>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        {[
                            ["গতকাল", yesterday],
                            ["গত সপ্তাহ", lastWeek],
                            ["গত মাস", lastMonth],
                        ].map(([label, price], index) => (
                            <div
                                key={label}
                                className={`flex items-center justify-between px-5 py-4 ${index !== 2 ? "border-b border-gray-100" : ""
                                    }`}
                            >
                                <span className="text-gray-600">{label}</span>
                                <span className="font-bold text-gray-800">
                                    {formatPrice(price)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Market prices */}
                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-800">
                        🏪 বাজারভিত্তিক দাম
                    </h2>

                    {markets.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {markets.map((market, index) => (
                                <article
                                    key={`${market.market || "market"}-${index}`}
                                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-bold text-gray-800">
                                                {market.market || "স্থানীয় বাজার"}
                                            </h3>
                                            {market.division && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {market.division}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-2xl">🏬</span>
                                    </div>

                                    <div className="mt-4 rounded-xl bg-gray-50 p-4">
                                        <p className="text-sm text-gray-500">
                                            দাম (প্রতি {unit})
                                        </p>
                                        <p className="mt-1 text-xl font-bold text-green-700">
                                            {formatPrice(Number(market.min || 0))}
                                            {" – "}
                                            {formatPrice(Number(market.max || 0))}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                            <p className="text-gray-500">
                                এই পণ্যের জন্য আলাদা বাজারের তথ্য পাওয়া যায়নি।
                            </p>
                        </div>
                    )}
                </section>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                    >
                        ← বাজারদরের তালিকায় ফিরে যাও
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function ProductPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-gray-50">
                    <p className="text-gray-600">লোড হচ্ছে...</p>
                </div>
            }
        >
            <ProductAuthGuard>
                <ProductDetails />
            </ProductAuthGuard>
        </Suspense>
    );
}