const BASE_URL =
    "https://api.abcz.workers.dev/api/bazardor";

export async function getProducts() {
    const response = await fetch(`${BASE_URL}/products`);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
}

export async function getProduct(id) {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}

export async function getCategories() {
    const response = await fetch(`${BASE_URL}/categories`);

    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    return response.json();
}

export async function getCategory(slug) {
    const response = await fetch(`${BASE_URL}/categories/${slug}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}