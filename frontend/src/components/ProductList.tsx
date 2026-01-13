import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllProducts, fetchProductsByCategory, type Product } from '../api/products';
import ProductCard from './ProductCard';
import ProductListSkeleton from './ProductListSkeleton';
import '../styles/ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchParams] = useSearchParams();
    const categoryID = searchParams.get("category_id");

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                let data: Product[];

                if (categoryID) {
                    data = await fetchProductsByCategory(Number(categoryID));
                } else {
                    data = await fetchAllProducts();
                }
                setProducts(data);

            } catch (err) {
                setError("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [categoryID]);

    if (loading) return <div id="loading" ><ProductListSkeleton /></div>
    if (error) return <div id="error" >{error}</div>

    return (
        <div className="product-list-container" >
            <p className="product-count" >
                {products.length} {products.length === 1 ? "tuote" : "tuotetta"}
            </p>
            <div className="product-grid" >
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default ProductList