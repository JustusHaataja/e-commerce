import { getJSON } from './apiClient';

export interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sale_price?: number | null;
    category_id: number;
    nutrition?: string | null;
    images: ProductImage[];
}

// Simple in-memory cache
let productsCache: Product[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000;   // 5 min

export const fetchProductById = async (id: number): Promise<Product> => {
    const product = await getJSON<Product>(`products/${id}`);
    return sanitizeProduct(product);
}


export const fetchAllProducts = async (): Promise<Product[]> => {
    const timeNow = Date.now();

    if (productsCache && cacheTimestamp && (timeNow - cacheTimestamp) < CACHE_DURATION) {
        return productsCache;
    }

    const products = await getJSON<Product[]>('/products/?skip=0&limit=100');
    const sanitizedProducts = products.map(sanitizeProduct).sort((a, b) => a.id - b.id);

    // update cache
    productsCache = sanitizedProducts;
    cacheTimestamp = timeNow;

    return productsCache;
}


export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
    const products = await getJSON<Product[]>(`/products/?category_id=${categoryId}`);
    return products.map(sanitizeProduct).sort((a, b) => a.id - b.id);
}


const sanitizeProduct = (product: Product): Product => {
    if (!product.images) return product;

    const sanitizedImages = product.images.map(img => ({
        ...img,
        image_url: img.image_url.trim().replace("https//", "https://")
    })).sort((a, b) => a.id - b.id);

    return { ...product, images: sanitizedImages };
}