
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    toBanglaNumber,
    getProductSlug,
} from "./priceUtils";

const API_URL = "/api/products";

// Product অনুযায়ী Emoji
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
    "sorishar-tel": "🫙",
    "pam-tel": "🫙",
    "ghani-banga-sorishar-tel": "🫙",
    "morich-gunda": "🌶️",
    "dhanepata-gunda": "🌿",
};

const CATEGORY_ICONS = {
    chal: "🍚",
    dal: "🥜",
    tel: "🫙",
    sobji: "🥬",
    mach: "🐟",
    mangsho: "🍗",
    "dim-dui": "🥚",
    mosla: "🌶️",
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

// Product emoji
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

    // API-তে image emoji থাকলে সেটি দেখাবে
    const image = product?.image;

    if (
        typeof image === "string" &&
        image.trim() &&
        !/^https?:\/\//i.test(image)
    ) {
        return image;
    }

    return (
        CATEGORY_ICONS[category] ||
        product?.categoryIcon ||
        "🛒"
    );
}

// Product price
function getProductPrice(product) {
    const value =
        product?.today ??
        product?.price ??
        product?.todayPrice ??
        product?.today_price ??
        product?.currentPrice ??
        product?.current_price;

    if (
        value === null ||
        value === undefined ||
        value === "" ||
        !Number.isFinite(Number(value))
    ) {
        return null;
    }

    return Number(value);
}

// Price formatting
function formatPrice(value) {
    if (value === null) {
        return "দাম পাওয়া যায়নি";
    }

    const formatted = Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    });

    return `${toBanglaNumber(formatted)} টাকা`;
}

// Unit বাংলায়
function getUnit(unit) {
    const units = {
        kg: "কেজি",
        litre: "লিটার",
        liter: "লিটার",
        l: "লিটার",
        gram: "গ্রাম",
        g: "গ্রাম",
        dozen: "ডজন",
        piece: "টি",
        pcs: "টি",
    };

    const normalizedUnit = String(unit || "")
        .trim()
        .toLowerCase();

    return units[normalizedUnit] || unit || "একক";
}

export default function PriceFallers() {
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
                    throw new Error(
                        "পণ্যের তথ্য লোড করা যায়নি।"
                    );
                }

                const data = await response.json();

                const productList = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.products)
                        ? data.products
                        : Array.isArray(data?.data)
                            ? data.data
                            : Array.isArray(data?.data?.products)
                                ? data.data.products
                                : [];

                // দাম কমেছে এমন পণ্য বাছাই
                const fallers = productList
                    .filter((product) => {
                        const pct = Number(
                            product?.change?.pct
                        );

                        return (
                            product?.change?.dir === "down" &&
                            Number.isFinite(pct) &&
                            pct !== 0
                        );
                    })
                    // সবচেয়ে বেশি দাম কমেছে এমন পণ্য আগে
                    .sort((a, b) => {
                        return (
                            Math.abs(Number(b.change.pct)) -
                            Math.abs(Number(a.change.pct))
                        );
                    })
                    // সর্বোচ্চ ৬টি পণ্য
                    .slice(0, 6);

                if (active) {
                    setProducts(fallers);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.message ||
                        "পণ্যের তথ্য লোড করা যায়নি।"
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
        <section className="bg-[#f3f8f4] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-2xl">
                        📉
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            আজ দাম কমেছে ▼
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            আজ যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে
                        </p>
                    </div>
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="flex animate-pulse items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5"
                                >
                                    <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200" />

                                    <div className="flex-1">
                                        <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
                                        <div className="mb-3 h-3 w-1/2 rounded bg-gray-200" />
                                        <div className="h-4 w-2/3 rounded bg-gray-200" />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-center text-red-600">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-gray-500">
                        কোনো পণ্যের দাম কমেনি।
                    </div>
                )}

                {/* Product Cards */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product, index) => {
                            const slug = getProductSlug(product);
                            const name = getProductName(product);
                            const icon = getProductIcon(product);
                            const price = getProductPrice(product);

                            const percentage = Math.abs(
                                Number(product?.change?.pct) || 0
                            );

                            const cardContent = (
                                <>
                                    {/* Product Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-3xl">
                                            <span
                                                role="img"
                                                aria-label={name}
                                            >
                                                {icon}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-lg font-semibold text-gray-900 group-hover:text-green-700">
                                                {name}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                প্রতি{" "}
                                                {getUnit(product?.unit)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Today's Price */}
                                    <div className="mt-5 flex items-end justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm text-gray-500">
                                                আজকের দাম
                                            </p>

                                            <p className="mt-1 break-words text-lg font-bold text-gray-900">
                                                {formatPrice(price)}
                                            </p>
                                        </div>

                                        {/* Price Decrease Badge */}
                                        <span className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">
                                            ▼{" "}
                                            {toBanglaNumber(
                                                percentage.toFixed(1)
                                            )}
                                            %
                                        </span>
                                    </div>
                                </>
                            );

                            return slug ? (
                                <Link
                                    key={product?.id ?? slug}
                                    href={`/product/${slug}`}
                                    className="group block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
                                >
                                    {cardContent}
                                </Link>
                            ) : (
                                <div
                                    key={product?.id ?? index}
                                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                                >
                                    {cardContent}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

