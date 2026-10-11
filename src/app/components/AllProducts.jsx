
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toBanglaNumber, getProductSlug } from "./priceUtils";

const API_URL = "/api/products";

// Category অনুযায়ী Emoji
const CATEGORY_ICONS = {
    chal: "🍚",
    dal: "🥜",
    tel: "🛢️",
    sobji: "🥬",
    mach: "🐟",
    mangsho: "🍗",
    "dim-dui": "🥚",
    mosla: "🌶️",
};

// Product অনুযায়ী আলাদা Emoji
const PRODUCT_ICONS = {
    peyaj: "🧅",
    begun: "🍆",
    ada: "🌿",
    roshun: "🧄",
    alu: "🥔",
    "kaccha-moric": "🌶️",

    "rui-mach": "🐟",
    "ilish-mach": "🐠",
    "katla-mach": "🐟",
    "chingri-mach": "🦐",

    "goru-r-mangsho": "🥩",
    "khasir-mangsho": "🍖",
    "hanser-mangsho": "🦆",
    "murgi-r-mangsho": "🍗",

    dim: "🥚",
    "dui-dudh": "🥛",
    doi: "🥣",
    mokhhan: "🧈",

    "sorno-machi-chal": "🍚",
    "miniket-chal": "🍚",
    "nazir-chal": "🍚",
    "batam-size-chal": "🍚",

    "mosur-dal": "🥜",
    "mug-dal": "🥜",
    "chola-dal": "🥜",
    "aman-dal-khosasila": "🥜",

    "sorishar-tel": "🛢️",
    "pam-tel": "🛢️",
    "ghani-banga-sorishar-tel": "🛢️",

    "morich-gunda": "🌶️",
    "dhanepata-gunda": "🌿",
};

// Product name
function getProductName(product) {
    return (
        product?.nameBn ||
        product?.name ||
        product?.title ||
        "পণ্য"
    );
}

// Product slug অনুযায়ী Emoji
function getProductIcon(product) {
    const slug = String(product?.slug || "")
        .trim()
        .toLowerCase();

    if (PRODUCT_ICONS[slug]) {
        return PRODUCT_ICONS[slug];
    }

    const category = String(product?.category || "")
        .trim()
        .toLowerCase();

    return CATEGORY_ICONS[category] || "🛒";
}

// Product price
function getProductPrice(product) {
    const price =
        product?.today ??
        product?.price ??
        product?.todayPrice ??
        product?.today_price ??
        product?.currentPrice ??
        product?.current_price;

    if (
        price === null ||
        price === undefined ||
        price === "" ||
        !Number.isFinite(Number(price))
    ) {
        return null;
    }

    return Number(price);
}

// Unit বাংলায় দেখানো
function getUnit(unit) {
    const units = {
        kg: "কেজি",
        litre: "লিটার",
        liter: "লিটার",
        dozen: "ডজন",
        piece: "টি",
    };

    return units[String(unit || "").toLowerCase()] || unit || "";
}

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchProducts() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(API_URL, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
                }

                const result = await response.json();

                const productList = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.products)
                        ? result.products
                        : Array.isArray(result?.data)
                            ? result.data
                            : Array.isArray(result?.data?.products)
                                ? result.data.products
                                : [];

                if (active) {
                    // সর্বোচ্চ ৩২টি পণ্য দেখাবে
                    setProducts(productList.slice(0, 32));

                    if (productList.length === 0) {
                        setError("কোনো পণ্য পাওয়া যায়নি।");
                    }
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.message ||
                        "পণ্য লোড করতে সমস্যা হয়েছে।"
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchProducts();

        return () => {
            active = false;
        };
    }, []);

    return (
        <section
            id="সব-পণ্য"
            className="scroll-mt-24 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                {/* Heading */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-sm font-semibold text-green-700">
                            বাজারদর
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            আজকের পণ্যের দাম
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ দাম দেখুন।
                        </p>
                    </div>

                    {!loading && !error && (
                        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                            মোট {toBanglaNumber(products.length)} টি পণ্য
                        </span>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
                            >
                                <div className="mb-4 h-20 w-20 rounded-xl bg-gray-200" />
                                <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
                                <div className="h-5 w-1/2 rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                )}

                {/* Product Cards */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {products.map((product, index) => {
                            const productName = getProductName(product);
                            const icon = getProductIcon(product);
                            const price = getProductPrice(product);
                            const slug = getProductSlug(product);
                            const change = product?.change;

                            return (
                                <Link
                                    key={product?.id ?? product?.slug ?? index}
                                    href={slug ? `/product/${slug}` : "#সব-পণ্য"}
                                    className="group rounded-2xl border border-gray-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
                                >
                                    {/* Product Emoji */}
                                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-green-50">
                                        <span
                                            className="text-5xl leading-none"
                                            role="img"
                                            aria-label={productName}
                                        >
                                            {icon}
                                        </span>
                                    </div>

                                    {/* Product Name */}
                                    <h3 className="min-h-12 text-base font-semibold text-gray-900 group-hover:text-green-700">
                                        {productName}
                                    </h3>

                                    {/* Today's Price */}
                                    <p className="mt-2 text-lg font-bold text-green-700">
                                        {price !== null
                                            ? `${toBanglaNumber(price)} টাকা`
                                            : "দাম পাওয়া যায়নি"}
                                    </p>

                                    {/* Unit */}
                                    <p className="mt-1 text-xs text-gray-500">
                                        প্রতি {getUnit(product?.unit)}
                                    </p>

                                    {/* Price Change */}
                                    {change && (
                                        <p
                                            className={`mt-2 text-xs font-medium ${change.dir === "up"
                                                ? "text-red-600"
                                                : change.dir === "down"
                                                    ? "text-green-600"
                                                    : "text-gray-500"
                                                }`}
                                        >
                                            {change.dir === "up"
                                                ? "▲"
                                                : change.dir === "down"
                                                    ? "▼"
                                                    : "—"}{" "}
                                            {toBanglaNumber(
                                                Math.abs(
                                                    Number(change.pct) || 0
                                                )
                                            )}
                                            %
                                        </p>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && products.length === 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
                        কোনো পণ্য পাওয়া যায়নি।
                    </div>
                )}
            </div>
        </section>
    );
}

