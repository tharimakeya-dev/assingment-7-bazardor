
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductSlug } from "./priceUtils";

const API_URL = "/api/products";

// Category অনুযায়ী Emoji
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
    "katla-mach": "🐠",
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
    "sorishar-tel": "🫙",
    "pam-tel": "🫙",
    "ghani-banga-sorishar-tel": "🫙",
    "morich-gunda": "🌶️",
    "dhanepata-gunda": "🌿",
};

// বাংলা সংখ্যা ও comma format
function toBanglaNumber(value) {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    return String(value).replace(/\d/g, (digit) =>
        "০১২৩৪৫৬৭৮৯"[Number(digit)]
    );
}

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

    return CATEGORY_ICONS[category] || "🛒";
}

// Price
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

// Price format: 1,850 → ১,৮৫০
function formatPrice(value) {
    if (value === null) {
        return "দাম পাওয়া যায়নি";
    }

    const formatted = Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    });

    return `${toBanglaNumber(formatted)} টাকা`;
}

// Unit
function getUnit(unit) {
    const units = {
        kg: "কেজি",
        litre: "লিটার",
        liter: "লিটার",
        dozen: "ডজন",
        piece: "পিস",
    };

    return units[String(unit || "").toLowerCase()] || unit || "একক";
}

export default function PriceRisers() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

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

                if (isMounted) {
                    setProducts(productList);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err.message || "পণ্য লোড করতে সমস্যা হয়েছে।"
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    // দাম বাড়া পণ্য: বেশি percentage আগে, সর্বোচ্চ ৬টি
    const risingProducts = products
        .filter(
            (product) =>
                product?.change?.dir === "up" &&
                Number.isFinite(Number(product?.change?.pct)) &&
                Number(product.change.pct) > 0
        )
        .sort(
            (a, b) =>
                Number(b.change.pct) - Number(a.change.pct)
        )
        .slice(0, 6);

    return (
        <section
            id="price-risers"
            className="w-full bg-white py-8 sm:py-10"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl">
                        📈
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            আজ দাম বেড়েছে ▲
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            আজ যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex h-32 animate-pulse items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
                            >
                                <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200" />

                                <div className="flex-1">
                                    <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
                                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
                        {error}

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="ml-3 font-semibold underline"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading &&
                    !error &&
                    risingProducts.length === 0 && (
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center text-gray-500">
                            আজ দাম বেড়েছে এমন কোনো পণ্য পাওয়া যায়নি।
                        </div>
                    )}

                {/* Rising Product Cards */}
                {!loading &&
                    !error &&
                    risingProducts.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {risingProducts.map((product, index) => {
                                const name = getProductName(product);
                                const icon = getProductIcon(product);
                                const price = getProductPrice(product);
                                const slug = getProductSlug(product);
                                const percentage = Math.abs(
                                    Number(product.change.pct)
                                );

                                const cardContent = (
                                    <>
                                        {/* Emoji */}
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-50 text-3xl">
                                            <span
                                                role="img"
                                                aria-label={name}
                                            >
                                                {icon}
                                            </span>
                                        </div>

                                        {/* Product Info */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-semibold text-gray-800 group-hover:text-green-700">
                                                {name}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                প্রতি {getUnit(product.unit)}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-500">
                                                আজকের দাম
                                            </p>

                                            <p className="font-bold text-gray-900">
                                                {formatPrice(price)}
                                            </p>
                                        </div>

                                        {/* Price Change Badge */}
                                        <div className="shrink-0 self-center rounded-lg bg-green-50 px-2.5 py-2 text-right">
                                            <p className="text-sm font-bold text-green-700">
                                                ▲ {toBanglaNumber(
                                                    percentage.toFixed(1)
                                                )}%
                                            </p>

                                            <p className="mt-0.5 text-xs text-green-700">
                                                দাম বেড়েছে
                                            </p>
                                        </div>
                                    </>
                                );

                                return slug ? (
                                    <Link
                                        key={product.id ?? slug ?? index}
                                        href={`/product/${slug}`}
                                        className="group flex min-w-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md sm:gap-4 sm:p-4"
                                    >
                                        {cardContent}
                                    </Link>
                                ) : (
                                    <div
                                        key={product.id ?? index}
                                        className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:gap-4 sm:p-4"
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

