
// Convert English numbers to Bangla numbers
export const toBanglaNumber = (value) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const banglaDigits = "০১২৩৪৫৬৭৮৯";

    return String(value).replace(/\d/g, (digit) => {
        return banglaDigits[Number(digit)];
    });
};

// Get product slug
export const getProductSlug = (product) => {
    if (!product) {
        return "";
    }

    if (product.slug) {
        return product.slug;
    }

    const name = product.nameBn || product.name || "";

    return String(name)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
};

